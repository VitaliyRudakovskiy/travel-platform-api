import { createHash } from "node:crypto";
import { ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { of, throwError } from "rxjs";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { ClaimsService } from "./claims.service";

const userId = faker.string.uuid();
const token = "header.payload.signature";
const tokenKey = `jwt:claims:${createHash("sha256").update(token).digest("hex")}`;
const identity = { id: userId, email: "user@travel.local", role: "User", isEmailVerified: true };
const claims = { id: userId, role: "User", isEmailVerified: true };

function axiosError(status: number) {
  return Object.assign(new Error(`status ${status}`), { isAxiosError: true, response: { status } });
}

describe("ClaimsService", () => {
  const jwt = { verifyAsync: vi.fn() };
  const http = { get: vi.fn() };
  const redis = { get: vi.fn(), set: vi.fn() };
  const config = { get: vi.fn().mockReturnValue(undefined) };
  let service: ClaimsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new ClaimsService(jwt as never, http as never, redis as never, config as never);
    jwt.verifyAsync.mockResolvedValue({
      sub: userId,
      role: "User",
      exp: Math.floor(Date.now() / 1000) + 600,
    });
  });

  describe("claimsForToken", () => {
    it("rejects an invalid or expired token without touching Redis or auth-service", async () => {
      jwt.verifyAsync.mockRejectedValue(new Error("jwt expired"));

      await expect(service.claimsForToken(token)).rejects.toThrow(UnauthorizedException);
      expect(redis.get).not.toHaveBeenCalled();
      expect(http.get).not.toHaveBeenCalled();
    });

    it("cache hit: returns cached claims without calling auth-service", async () => {
      redis.get.mockResolvedValue(JSON.stringify(claims));

      await expect(service.claimsForToken(token)).resolves.toEqual(claims);
      expect(redis.get).toHaveBeenCalledWith(tokenKey); // the key is the token HASH, never the token
      expect(http.get).not.toHaveBeenCalled();
    });

    it("cache miss: asks auth-service and caches the claims for the remaining life of the token", async () => {
      redis.get.mockResolvedValue(null);
      http.get.mockReturnValue(of({ data: identity }));

      await expect(service.claimsForToken(token)).resolves.toEqual(claims);
      expect(http.get).toHaveBeenCalledWith(`http://localhost:3001/internal/v1/users/${userId}`);

      const [key, value, mode, ttl] = redis.set.mock.calls[0];
      expect([key, JSON.parse(value), mode]).toEqual([tokenKey, claims, "EX"]);
      expect(ttl).toBeGreaterThan(590);
      expect(ttl).toBeLessThanOrEqual(600);
    });

    it("answers 401 when the token's user no longer exists", async () => {
      redis.get.mockResolvedValue(null);
      http.get.mockReturnValue(throwError(() => axiosError(404)));

      await expect(service.claimsForToken(token)).rejects.toThrow("User no longer exists");
    });

    it("answers 503 when auth-service is unreachable on a cache miss", async () => {
      redis.get.mockResolvedValue(null);
      http.get.mockReturnValue(throwError(() => new Error("connect ECONNREFUSED")));

      await expect(service.claimsForToken(token)).rejects.toThrow(ServiceUnavailableException);
    });

    it("keeps working when Redis is down (falls back to auth-service)", async () => {
      redis.get.mockRejectedValue(new Error("Connection is closed"));
      redis.set.mockRejectedValue(new Error("Connection is closed"));
      http.get.mockReturnValue(of({ data: identity }));

      await expect(service.claimsForToken(token)).resolves.toEqual(claims);
    });
  });

  describe("claimsForUserId (v1)", () => {
    it("returns null for an unknown user or a malformed id", async () => {
      redis.get.mockResolvedValue(null);
      http.get.mockReturnValueOnce(throwError(() => axiosError(404)));
      http.get.mockReturnValueOnce(throwError(() => axiosError(400)));

      await expect(service.claimsForUserId(userId)).resolves.toBeNull();
      await expect(service.claimsForUserId("not-a-uuid")).resolves.toBeNull();
      expect(redis.set).not.toHaveBeenCalled();
    });

    it("caches a found identity briefly", async () => {
      redis.get.mockResolvedValue(null);
      http.get.mockReturnValue(of({ data: identity }));

      await expect(service.claimsForUserId(userId)).resolves.toEqual(claims);
      expect(redis.set).toHaveBeenCalledWith(
        `v1:identity:${userId}`,
        JSON.stringify(claims),
        "EX",
        60,
      );
    });
  });
});

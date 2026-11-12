import { UnauthorizedException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { type ClaimsService } from "./claims.service";
import { IdentityGuard } from "./identity.guard";

const userId = faker.string.uuid();
const claims = { id: userId, role: "User", isEmailVerified: false };

function context(method: string, path: string, headers: Record<string, string> = {}) {
  const request = { method, path, headers: { ...headers } as Record<string, string | undefined> };
  return {
    request,
    context: { switchToHttp: () => ({ getRequest: () => request }) } as never,
  };
}

describe("IdentityGuard", () => {
  const claimsService = { claimsForToken: vi.fn(), claimsForUserId: vi.fn() };
  let guard: IdentityGuard;

  beforeEach(() => {
    vi.resetAllMocks();
    guard = new IdentityGuard(claimsService as unknown as ClaimsService);
  });

  describe("v2", () => {
    it("requires a token on protected routes", async () => {
      const { context: ctx } = context("GET", "/api/v2/bookings");

      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it("lets public routes through without a token and without identity headers", async () => {
      const { context: ctx, request } = context("POST", "/api/v2/sessions/refresh");

      await expect(guard.canActivate(ctx)).resolves.toBe(true);
      expect(request.headers["x-user-id"]).toBeUndefined();
      expect(claimsService.claimsForToken).not.toHaveBeenCalled();
    });

    it("replaces spoofed identity headers with the claims of the token", async () => {
      claimsService.claimsForToken.mockResolvedValue(claims);
      const { context: ctx, request } = context("GET", "/api/v2/analytics/bookings", {
        authorization: "Bearer the-token",
        "x-user-id": "admin-id",
        "x-user-role": "Admin",
        "x-email-verified": "true",
      });

      await guard.canActivate(ctx);

      expect(claimsService.claimsForToken).toHaveBeenCalledWith("the-token");
      expect(request.headers).toEqual(
        expect.objectContaining({
          "x-user-id": userId,
          "x-user-role": "User",
          "x-email-verified": "false",
        }),
      );
    });

    it("strips spoofed headers on public routes too", async () => {
      const { context: ctx, request } = context("GET", "/api/v2/offers", {
        "x-user-role": "Admin",
      });

      await guard.canActivate(ctx);

      expect(request.headers["x-user-role"]).toBeUndefined();
    });

    it("ignores a non-Bearer Authorization header", async () => {
      const { context: ctx } = context("GET", "/api/v2/bookings", { authorization: "Basic abc" });

      await expect(guard.canActivate(ctx)).rejects.toThrow("Access token is required");
    });
  });

  describe("v1", () => {
    it("keeps X-User-Id and adds role / verification of a known user", async () => {
      claimsService.claimsForUserId.mockResolvedValue(claims);
      const { context: ctx, request } = context("GET", "/api/v1/bookings", {
        "x-user-id": userId,
        "x-user-role": "Admin", // spoofed
      });

      await expect(guard.canActivate(ctx)).resolves.toBe(true);
      expect(request.headers["x-user-role"]).toBe("User");
      expect(request.headers["x-user-id"]).toBe(userId);
    });

    it("forwards X-User-Id of an unknown user without a role (the service answers 404)", async () => {
      claimsService.claimsForUserId.mockResolvedValue(null);
      const { context: ctx, request } = context("GET", "/api/v1/users/x", { "x-user-id": userId });

      await guard.canActivate(ctx);

      expect(request.headers["x-user-id"]).toBe(userId);
      expect(request.headers["x-user-role"]).toBeUndefined();
    });

    it("does nothing without X-User-Id (public v1 routes, or 401 from the service)", async () => {
      const { context: ctx } = context("GET", "/api/v1/offers");

      await expect(guard.canActivate(ctx)).resolves.toBe(true);
      expect(claimsService.claimsForUserId).not.toHaveBeenCalled();
    });
  });
});

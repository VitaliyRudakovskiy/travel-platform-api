import { createHash } from "node:crypto";
import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { SessionsService } from "./sessions.service";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { userMock } from "@tests/mocks/user.mock";
import { loginMock } from "@tests/mocks/login.mock";

// Explicitly typed: vi.mocked(bcrypt.compare) picks the callback overload (returns void),
// which makes mockResolvedValue(true) a type error.
const { compareMock } = vi.hoisted(() => ({
  compareMock: vi.fn<(data: string, encrypted: string) => Promise<boolean>>(),
}));

vi.mock("bcrypt", () => ({
  compare: compareMock,
}));

const jwtServiceMock = {
  signAsync: vi.fn(),
};

describe("SessionsService", () => {
  let service: SessionsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        providePrisma(),
        { provide: JwtService, useValue: jwtServiceMock },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue("7d"),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    it("returns session response for valid credentials", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);
      compareMock.mockResolvedValue(true);

      const result = await service.login(loginMock);

      expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: loginMock.email },
      });
      expect(compareMock).toHaveBeenCalledWith(loginMock.password, userMock.passwordHash);

      expect(result).toEqual({
        userId: userMock.id,
        username: userMock.username,
        email: userMock.email,
        createdAt: userMock.createdAt,
      });
    });

    it("throws UnauthorizedException when user is not found", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(null);

      await expect(service.login(loginMock)).rejects.toThrow(UnauthorizedException);

      expect(compareMock).not.toHaveBeenCalled();
    });

    it("throws UnauthorizedException when password is invalid", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);
      compareMock.mockResolvedValue(false);

      await expect(service.login(loginMock)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("loginWithTokens", () => {
    it("returns access and refresh tokens and stores a hashed refresh token", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);
      compareMock.mockResolvedValue(true);
      jwtServiceMock.signAsync.mockResolvedValue("access-token");
      prismaServiceMock.userSession.create.mockResolvedValue({});

      const result = await service.loginWithTokens(loginMock);

      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toEqual(expect.any(String));
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: userMock.id,
        role: userMock.role,
      });
      expect(prismaServiceMock.userSession.create).toHaveBeenCalledWith({
        data: {
          userId: userMock.id,
          refreshTokenHash: createHash("sha256").update(result.refreshToken).digest("hex"),
          expiresAt: expect.any(Date),
        },
      });
    });
  });

  describe("refreshAccessToken", () => {
    const refreshToken = "refresh-token";
    const session = {
      id: "session-id",
      userId: userMock.id,
      refreshTokenHash: createHash("sha256").update(refreshToken).digest("hex"),
      expiresAt: new Date(Date.now() + 60_000),
    };

    it("returns a new access token for a valid refresh token", async () => {
      prismaServiceMock.userSession.findUnique.mockResolvedValue(session);
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);
      jwtServiceMock.signAsync.mockResolvedValue("new-access-token");

      const result = await service.refreshAccessToken(refreshToken);

      expect(result).toEqual({ accessToken: "new-access-token" });
      expect(prismaServiceMock.userSession.delete).not.toHaveBeenCalled();
    });

    it("throws UnauthorizedException when the refresh token is unknown", async () => {
      prismaServiceMock.userSession.findUnique.mockResolvedValue(null);

      await expect(service.refreshAccessToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it("throws UnauthorizedException when the refresh token is expired", async () => {
      prismaServiceMock.userSession.findUnique.mockResolvedValue({
        ...session,
        expiresAt: new Date(0),
      });

      await expect(service.refreshAccessToken(refreshToken)).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.userSession.delete).toHaveBeenCalledWith({
        where: { id: session.id },
      });
    });
  });

  describe("logout", () => {
    const refreshToken = "refresh-token";
    const session = {
      id: "session-id",
      userId: userMock.id,
      refreshTokenHash: createHash("sha256").update(refreshToken).digest("hex"),
      expiresAt: new Date(Date.now() + 60_000),
    };

    it("deletes the refresh token session", async () => {
      prismaServiceMock.userSession.findUnique.mockResolvedValue(session);
      prismaServiceMock.userSession.delete.mockResolvedValue(session);

      await service.logout(refreshToken);

      expect(prismaServiceMock.userSession.delete).toHaveBeenCalledWith({
        where: { id: session.id },
      });
    });

    it("throws UnauthorizedException when the refresh token was already revoked", async () => {
      prismaServiceMock.userSession.findUnique.mockResolvedValue(null);

      await expect(service.logout(refreshToken)).rejects.toThrow(UnauthorizedException);
      expect(prismaServiceMock.userSession.delete).not.toHaveBeenCalled();
    });
  });
});

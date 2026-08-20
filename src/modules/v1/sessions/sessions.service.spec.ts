import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { SessionsService } from "./sessions.service";
import * as bcrypt from "bcrypt";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { userMock } from "@tests/mocks/user.mock";
import { loginMock } from "@tests/mocks/login.mock";

vi.mock("bcrypt", () => ({
  compare: vi.fn(),
}));

describe("SessionsService", () => {
  let service: SessionsService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsService, providePrisma()],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    it("returns session response for valid credentials", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);

      const result = await service.login(loginMock);

      expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: loginMock.email },
      });

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

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("throws UnauthorizedException when password is invalid", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      await expect(service.login(loginMock)).rejects.toThrow(UnauthorizedException);
    });
  });
});

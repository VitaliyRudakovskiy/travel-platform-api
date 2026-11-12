import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { userMock } from "@tests/mocks/user.mock";
import { JwtStrategy } from "./jwt.strategy";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        providePrisma(),
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: vi.fn().mockReturnValue("test-secret"),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it("returns the user without the password hash", async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue(userMock);

    const result = await strategy.validate({ sub: userMock.id });

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: userMock.id },
    });
    expect(result).toEqual({
      id: userMock.id,
      username: userMock.username,
      email: userMock.email,
      role: userMock.role,
      isEmailVerified: userMock.isEmailVerified,
      createdAt: userMock.createdAt,
      updatedAt: userMock.updatedAt,
    });
    expect(result).not.toHaveProperty("passwordHash");
  });

  it("throws UnauthorizedException when the user is not found", async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue(null);

    await expect(strategy.validate({ sub: userMock.id })).rejects.toThrow(UnauthorizedException);
  });
});

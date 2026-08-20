import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { SessionsService } from "./sessions.service";
import * as bcrypt from "bcrypt";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";

vi.mock("bcrypt", () => ({
  compare: vi.fn(),
}));

const loginDto = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const user = {
  id: faker.string.uuid(),
  username: faker.internet.username(),
  email: loginDto.email,
  passwordHash: faker.string.alphanumeric(60),
  createdAt: faker.date.past(),
};

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
      prismaServiceMock.user.findFirst.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });

      expect(result).toEqual({
        userId: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    });

    it("throws UnauthorizedException when user is not found", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("throws UnauthorizedException when password is invalid", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});

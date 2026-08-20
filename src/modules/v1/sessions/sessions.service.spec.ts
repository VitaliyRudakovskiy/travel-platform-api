import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@services/prisma.service";
import { UnauthorizedException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { SessionsService } from "./sessions.service";
import * as bcrypt from "bcrypt";

vi.mock("bcrypt", () => ({
  compare: vi.fn(),
}));

const prismaMock = {
  user: {
    findFirst: vi.fn(),
  },
};

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
      providers: [SessionsService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    it("returns session response for valid credentials", async () => {
      prismaMock.user.findFirst.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
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
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("throws UnauthorizedException when password is invalid", async () => {
      prismaMock.user.findFirst.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});

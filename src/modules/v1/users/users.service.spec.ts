import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UsersService } from "./users.service";
import bcrypt from "bcrypt";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { userMock } from "@tests/mocks/user.mock";
import { loginMock } from "@tests/mocks/login.mock";

vi.mock("bcrypt", () => ({
  default: {
    genSaltSync: vi.fn(),
    hash: vi.fn(),
  },
}));

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, providePrisma()],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("returns users mapped to response DTOs", async () => {
      prismaServiceMock.user.findMany.mockResolvedValue([userMock]);

      const result = await service.getAll();

      expect(prismaServiceMock.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });

      expect(result).toEqual([
        {
          id: userMock.id,
          username: userMock.username,
          email: userMock.email,
          createdAt: userMock.createdAt,
          updatedAt: userMock.updatedAt,
        },
      ]);
    });
  });

  describe("getById", () => {
    it("returns the user when found", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);

      const result = await service.getById(userMock.id);

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: userMock.id },
      });

      expect(result).toEqual({
        id: userMock.id,
        username: userMock.username,
        email: userMock.email,
        createdAt: userMock.createdAt,
        updatedAt: userMock.updatedAt,
      });
    });

    it("throws NotFoundException when user is not found", async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getById(userMock.id)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    const createUserDto = {
      username: faker.internet.username(),
      email: loginMock.email,
      password: faker.internet.password(),
    };

    it("creates a user with a hashed password", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(null);
      vi.mocked(bcrypt.genSaltSync).mockReturnValue("salt");
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password");
      prismaServiceMock.user.create.mockResolvedValue(userMock);

      const result = await service.create(createUserDto);

      expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, "salt");
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
          passwordHash: "hashed-password",
        },
      });

      expect(result).toEqual({
        id: userMock.id,
        username: userMock.username,
        email: userMock.email,
        createdAt: userMock.createdAt,
        updatedAt: userMock.updatedAt,
      });
    });

    it("throws ConflictException when the email already exists", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);

      expect(bcrypt.genSaltSync).not.toHaveBeenCalled();
      expect(prismaServiceMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    const updateUserDto = {
      username: faker.internet.username(),
      email: faker.internet.email(),
    };

    it("updates the user when found", async () => {
      const updatedUser = { ...userMock, username: updateUserDto.username };
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);
      prismaServiceMock.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(userMock.id, updateUserDto);

      expect(prismaServiceMock.user.findFirst).toHaveBeenCalledWith({
        where: { id: userMock.id },
      });

      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        where: { id: userMock.id },
        data: updateUserDto,
      });

      expect(result).toEqual({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
    });

    it("throws NotFoundException when user is not found", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(null);

      await expect(service.update(userMock.id, updateUserDto)).rejects.toThrow(NotFoundException);

      expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
    });

    it("throws ConflictException when the email is already taken", async () => {
      prismaServiceMock.user.findFirst.mockResolvedValue(userMock);
      prismaServiceMock.user.findUnique.mockResolvedValue(userMock);

      await expect(
        service.update(userMock.id, {
          username: faker.internet.username(),
          email: faker.internet.email(),
        }),
      ).rejects.toThrow(ConflictException);

      expect(prismaServiceMock.user.update).not.toHaveBeenCalled();
    });
  });
});

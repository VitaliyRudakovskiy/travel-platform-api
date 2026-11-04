import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UserRole } from "#prisma";
import { UsersController } from "./users.controller";
import { providePrisma } from "@tests/providers/provide-prisma";
import { userMock } from "@tests/mocks/user.mock";
import { provideUsersService } from "@tests/providers/provide-users-service";
import { usersServiceMock } from "@tests/mocks/users-service.mock";
import { provideEmailVerificationsService } from "@tests/providers/provide-email-verifications-service";
import { emailVerificationsServiceMock } from "@tests/mocks/email-verifications-service.mock";

describe("UsersController v2", () => {
  let controller: UsersController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [provideUsersService(), provideEmailVerificationsService(), providePrisma()],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("get", () => {
    it("calls usersService.getAll and returns its result", async () => {
      const users = [userMock];
      usersServiceMock.getAll.mockResolvedValue(users);

      const result = await controller.get();

      expect(usersServiceMock.getAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe("getOne", () => {
    it("calls usersService.getById when userId matches current user", async () => {
      usersServiceMock.getById.mockResolvedValue(userMock);

      const result = await controller.getOne(userMock.id, {
        id: userMock.id,
        role: UserRole.User,
      } as never);

      expect(usersServiceMock.getById).toHaveBeenCalledWith(userMock.id);
      expect(result).toEqual(userMock);
    });

    it("calls usersService.getById when current user is Admin", async () => {
      usersServiceMock.getById.mockResolvedValue(userMock);

      const result = await controller.getOne(userMock.id, {
        id: faker.string.uuid(),
        role: UserRole.Admin,
      } as never);

      expect(usersServiceMock.getById).toHaveBeenCalledWith(userMock.id);
      expect(result).toEqual(userMock);
    });

    it("throws ForbiddenException when userId does not match current user", async () => {
      await expect(
        controller.getOne(userMock.id, {
          id: faker.string.uuid(),
          role: UserRole.User,
        } as never),
      ).rejects.toThrow(ForbiddenException);

      expect(usersServiceMock.getById).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates the user and issues an email verification", async () => {
      const createUserDto = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      usersServiceMock.createWithProfile.mockResolvedValue(userMock);
      emailVerificationsServiceMock.issue.mockResolvedValue(undefined);

      const result = await controller.create(createUserDto);

      expect(usersServiceMock.createWithProfile).toHaveBeenCalledWith(createUserDto);
      expect(emailVerificationsServiceMock.issue).toHaveBeenCalledWith(userMock.id);
      expect(result).toEqual(userMock);
    });
  });

  describe("resendEmailVerification", () => {
    it("issues a verification when userId matches current user", async () => {
      emailVerificationsServiceMock.issue.mockResolvedValue(undefined);

      await controller.resendEmailVerification(userMock.id, {
        id: userMock.id,
        role: UserRole.User,
      } as never);

      expect(emailVerificationsServiceMock.issue).toHaveBeenCalledWith(userMock.id);
    });

    it("issues a verification when current user is Admin", async () => {
      emailVerificationsServiceMock.issue.mockResolvedValue(undefined);

      await controller.resendEmailVerification(userMock.id, {
        id: faker.string.uuid(),
        role: UserRole.Admin,
      } as never);

      expect(emailVerificationsServiceMock.issue).toHaveBeenCalledWith(userMock.id);
    });

    it("throws ForbiddenException when userId does not match current user", async () => {
      await expect(
        controller.resendEmailVerification(userMock.id, {
          id: faker.string.uuid(),
          role: UserRole.User,
        } as never),
      ).rejects.toThrow(ForbiddenException);

      expect(emailVerificationsServiceMock.issue).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    const updateUserDto = {
      username: faker.internet.username(),
      email: faker.internet.email(),
    };

    it("calls usersService.update when userId matches current user", async () => {
      const updatedUser = { ...userMock, username: updateUserDto.username };
      usersServiceMock.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userMock.id, updateUserDto, {
        id: userMock.id,
        role: UserRole.User,
      } as never);

      expect(usersServiceMock.update).toHaveBeenCalledWith(userMock.id, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it("calls usersService.update when current user is Admin", async () => {
      const updatedUser = { ...userMock, username: updateUserDto.username };
      usersServiceMock.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userMock.id, updateUserDto, {
        id: faker.string.uuid(),
        role: UserRole.Admin,
      } as never);

      expect(usersServiceMock.update).toHaveBeenCalledWith(userMock.id, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it("throws ForbiddenException when userId does not match current user", async () => {
      await expect(
        controller.update(userMock.id, updateUserDto, {
          id: faker.string.uuid(),
          role: UserRole.User,
        } as never),
      ).rejects.toThrow(ForbiddenException);

      expect(usersServiceMock.update).not.toHaveBeenCalled();
    });
  });
});

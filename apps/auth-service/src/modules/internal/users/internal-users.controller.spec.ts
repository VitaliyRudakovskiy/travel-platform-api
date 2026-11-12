import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { userMock } from "../../../tests/mocks/user.mock";
import { UsersService } from "../../v1/users/users.service";
import { InternalUsersController } from "./internal-users.controller";

describe("InternalUsersController", () => {
  let controller: InternalUsersController;
  const usersService = { getIdentity: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalUsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<InternalUsersController>(InternalUsersController);
  });

  it("returns the user identity from UsersService", async () => {
    const identity = {
      id: userMock.id,
      email: userMock.email,
      role: userMock.role,
      isEmailVerified: true,
    };
    usersService.getIdentity.mockResolvedValue(identity);

    await expect(controller.getIdentity(userMock.id)).resolves.toEqual(identity);
    expect(usersService.getIdentity).toHaveBeenCalledWith(userMock.id);
  });
});

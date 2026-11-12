import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";
import { userMock } from "../../../tests/mocks/user.mock";

describe("SessionsController", () => {
  let controller: SessionsController;
  const sessionsService = { login: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [{ provide: SessionsService, useValue: sessionsService }],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("passes the user authenticated by LocalAuthGuard to sessionsService.login", () => {
    const session = {
      userId: faker.string.uuid(),
      username: faker.internet.username(),
      email: userMock.email,
      createdAt: faker.date.past(),
    };

    sessionsService.login.mockReturnValue(session);

    const result = controller.login(userMock);

    expect(sessionsService.login).toHaveBeenCalledWith(userMock);
    expect(result).toEqual(session);
  });
});

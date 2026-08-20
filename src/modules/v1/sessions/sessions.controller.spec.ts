import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

const loginDto = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

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

  it("calls sessionsService.login and returns its result", async () => {
    const session = {
      userId: faker.string.uuid(),
      username: faker.internet.username(),
      email: loginDto.email,
      createdAt: faker.date.past(),
    };
    sessionsService.login.mockResolvedValue(session);

    const result = await controller.login(loginDto);

    expect(sessionsService.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(session);
  });
});

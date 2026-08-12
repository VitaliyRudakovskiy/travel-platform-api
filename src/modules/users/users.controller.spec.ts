import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { describe, beforeEach, it, expect } from "vitest";

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

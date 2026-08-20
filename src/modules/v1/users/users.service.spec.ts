import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { describe, beforeEach, it, expect } from "vitest";
import { providePrisma } from "@tests/providers/provide-prisma";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, providePrisma()],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

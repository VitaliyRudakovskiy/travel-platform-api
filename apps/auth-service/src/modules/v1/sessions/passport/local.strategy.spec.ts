import { UnauthorizedException } from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { loginMock } from "../../../../tests/mocks/login.mock";
import { userMock } from "../../../../tests/mocks/user.mock";
import { type SessionsService } from "../sessions.service";
import { LocalStrategy } from "./local.strategy";

describe("LocalStrategy", () => {
  const sessionsService = { validateCredentials: vi.fn() };
  let strategy: LocalStrategy;

  beforeEach(() => {
    vi.clearAllMocks();
    strategy = new LocalStrategy(sessionsService as unknown as SessionsService);
  });

  it("returns the user for valid credentials", async () => {
    sessionsService.validateCredentials.mockResolvedValue(userMock);

    await expect(strategy.validate(loginMock.email, loginMock.password)).resolves.toBe(userMock);
    expect(sessionsService.validateCredentials).toHaveBeenCalledWith(loginMock);
  });

  it("propagates UnauthorizedException for invalid credentials", async () => {
    sessionsService.validateCredentials.mockRejectedValue(
      new UnauthorizedException("Invalid credentials"),
    );

    await expect(strategy.validate(loginMock.email, "wrong")).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

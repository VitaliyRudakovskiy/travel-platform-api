import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { describe, beforeEach, it, expect } from "vitest";
import { userMock } from "@tests/mocks/user.mock";
import { EmailVerifiedGuard } from "./email-verified.guard";

function mockExecutionContext(user?: { id: string; isEmailVerified: boolean }) {
  const request = { user };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  };

  return { context: context as never, request };
}

describe("EmailVerifiedGuard", () => {
  let guard: EmailVerifiedGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailVerifiedGuard],
    }).compile();

    guard = module.get<EmailVerifiedGuard>(EmailVerifiedGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("throws UnauthorizedException when the user is missing", () => {
    const { context } = mockExecutionContext();

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it("throws ForbiddenException when the email is not verified", () => {
    const { context } = mockExecutionContext({
      id: userMock.id,
      isEmailVerified: false,
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow("Email is not verified");
  });

  it("allows the request when the email is verified", () => {
    const { context } = mockExecutionContext({
      id: userMock.id,
      isEmailVerified: true,
    });

    expect(guard.canActivate(context)).toBe(true);
  });
});

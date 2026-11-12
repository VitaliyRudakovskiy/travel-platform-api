import { BadRequestException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { loginMock } from "../../../../tests/mocks/login.mock";
import { LocalAuthGuard } from "./local-auth.guard";

function mockExecutionContext(body: unknown) {
  const request = { body };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  };

  return { context: context as never, request };
}

describe("LocalAuthGuard", () => {
  let guard: LocalAuthGuard;
  let passportCanActivate: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    guard = new LocalAuthGuard();
    // The parent class is the passport-local AuthGuard: stub it, the strategy is tested separately.
    passportCanActivate = vi
      .spyOn(AuthGuard("local").prototype, "canActivate")
      .mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("answers 400 for a body without a password and does not call passport", async () => {
    const { context } = mockExecutionContext({ email: loginMock.email });

    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
    expect(passportCanActivate).not.toHaveBeenCalled();
  });

  it("answers 400 for an invalid email", async () => {
    const { context } = mockExecutionContext({
      email: "not-an-email",
      password: loginMock.password,
    });

    await expect(guard.canActivate(context)).rejects.toThrow("Validation failed");
  });

  it("delegates a valid body to passport-local", async () => {
    const { context, request } = mockExecutionContext({ ...loginMock, extra: "ignored" });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(passportCanActivate).toHaveBeenCalledOnce();
    // the body is replaced by the parsed one: unknown fields are stripped by Zod
    expect(request.body).toEqual(loginMock);
  });
});

import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect } from "vitest";
import { type AuthenticatedUser } from "./authenticated-user";
import { GatewayAuthGuard } from "./gateway-auth.guard";
import { UserRole } from "./user-role";

function mockExecutionContext(headers: Record<string, string | string[] | undefined>) {
  const request: { headers: typeof headers; user?: AuthenticatedUser } = { headers };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  };

  return { context: context as never, request };
}

describe("GatewayAuthGuard", () => {
  let guard: GatewayAuthGuard;
  const userId = faker.string.uuid();

  beforeEach(() => {
    guard = new GatewayAuthGuard();
  });

  it("throws UnauthorizedException when X-User-Id is missing", () => {
    const { context } = mockExecutionContext({ "x-user-role": UserRole.User });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow("X-User-Id header is required");
  });

  it("throws NotFoundException when X-User-Role is missing (the gateway did not find the user)", () => {
    const { context } = mockExecutionContext({ "x-user-id": userId });

    expect(() => guard.canActivate(context)).toThrow(NotFoundException);
    expect(() => guard.canActivate(context)).toThrow("User not found");
  });

  it("throws NotFoundException when X-User-Role is not a known role", () => {
    const { context } = mockExecutionContext({ "x-user-id": userId, "x-user-role": "SuperAdmin" });

    expect(() => guard.canActivate(context)).toThrow(NotFoundException);
  });

  it("attaches the user built from the gateway headers", () => {
    const { context, request } = mockExecutionContext({
      "x-user-id": userId,
      "x-user-role": UserRole.Agent,
      "x-email-verified": "true",
    });

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toEqual({ id: userId, role: UserRole.Agent, isEmailVerified: true });
  });

  it.each([["false"], [undefined], ["yes"]])(
    "treats X-Email-Verified=%s as not verified",
    (emailVerified) => {
      const { context, request } = mockExecutionContext({
        "x-user-id": userId,
        "x-user-role": UserRole.User,
        "x-email-verified": emailVerified,
      });

      guard.canActivate(context);

      expect(request.user?.isEmailVerified).toBe(false);
    },
  );

  it("uses the first value when a header is repeated", () => {
    const { context, request } = mockExecutionContext({
      "x-user-id": [userId, faker.string.uuid()],
      "x-user-role": UserRole.Admin,
    });

    guard.canActivate(context);

    expect(request.user?.id).toBe(userId);
  });
});

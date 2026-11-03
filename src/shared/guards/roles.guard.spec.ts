import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { UserRole } from "#prisma";
import { userMock } from "@tests/mocks/user.mock";
import { RolesGuard } from "./roles.guard";
import { ROLES_KEY } from "@shared/decorators/roles.decorator";

function mockExecutionContext(user?: { id: string; role: string }) {
  const request = { user };

  const context = {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  };

  return { context: context as never, request };
}

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let reflector: { getAllAndOverride: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();

    reflector = {
      getAllAndOverride: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("allows the request when no roles are required", () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const { context } = mockExecutionContext();

    expect(guard.canActivate(context)).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      expect.anything(),
      expect.anything(),
    ]);
  });

  it("throws UnauthorizedException when the user is missing", () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.Admin]);
    const { context } = mockExecutionContext();

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it("allows the request when the user has a required role", () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.Admin, UserRole.Agent]);
    const { context } = mockExecutionContext({
      id: userMock.id,
      role: UserRole.Agent,
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it("throws ForbiddenException when the user role is not allowed", () => {
    reflector.getAllAndOverride.mockReturnValue([UserRole.Admin]);
    const { context } = mockExecutionContext({
      id: userMock.id,
      role: UserRole.User,
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow("Insufficient role");
  });
});

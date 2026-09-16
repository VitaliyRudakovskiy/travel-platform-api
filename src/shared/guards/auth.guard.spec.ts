import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { AuthGuard } from "./auth.guard";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { userMock } from "@tests/mocks/user.mock";

function mockExecutionContext(headers: Record<string, string> = {}) {
  const request = { headers, user: undefined };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  };

  return { context: context as never, request };
}

describe("AuthGuard", () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, providePrisma()],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("throws UnauthorizedException when X-User-Id header is missing", async () => {
    const { context } = mockExecutionContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    await expect(guard.canActivate(context)).rejects.toThrow("X-User-Id header is required");

    expect(prismaServiceMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("throws UnauthorizedException when X-User-Id header is empty", async () => {
    const { context } = mockExecutionContext({ "x-user-id": "" });

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);

    expect(prismaServiceMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("throws NotFoundException when user is not found", async () => {
    const { context } = mockExecutionContext({ "x-user-id": userMock.id });
    prismaServiceMock.user.findUnique.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
    await expect(guard.canActivate(context)).rejects.toThrow("User not found");

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: userMock.id },
    });
  });

  it("attaches user to request and returns true when header is valid", async () => {
    const { context, request } = mockExecutionContext({ "x-user-id": userMock.id });
    prismaServiceMock.user.findUnique.mockResolvedValue(userMock);

    const result = await guard.canActivate(context);

    expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: userMock.id },
    });
    expect(request.user).toEqual(userMock);
    expect(result).toBe(true);
  });
});

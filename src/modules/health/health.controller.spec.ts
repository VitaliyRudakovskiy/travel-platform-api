import { Test, TestingModule } from "@nestjs/testing";
import { HealthCheckService, PrismaHealthIndicator } from "@nestjs/terminus";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { HealthController } from "./health.controller";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";

const healthCheckServiceMock = {
  check: vi.fn(),
};

const prismaHealthIndicatorMock = {
  pingCheck: vi.fn(),
};

describe("HealthController", () => {
  let controller: HealthController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        providePrisma(),
        { provide: HealthCheckService, useValue: healthCheckServiceMock },
        { provide: PrismaHealthIndicator, useValue: prismaHealthIndicatorMock },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("runs postgres health check", async () => {
    const healthResult = {
      status: "ok",
      info: { postgres: { status: "up" } },
      error: {},
      details: { postgres: { status: "up" } },
    };
    const pingCheckResult = { postgres: { status: "up" } };

    prismaHealthIndicatorMock.pingCheck.mockReturnValue(pingCheckResult);
    healthCheckServiceMock.check.mockResolvedValue(healthResult);

    const result = await controller.check();

    expect(healthCheckServiceMock.check).toHaveBeenCalledTimes(1);

    const checks = healthCheckServiceMock.check.mock.calls[0][0];
    expect(checks).toHaveLength(1);
    expect(checks[0]()).toEqual(pingCheckResult);

    expect(prismaHealthIndicatorMock.pingCheck).toHaveBeenCalledWith("postgres", prismaServiceMock);
    expect(result).toEqual(healthResult);
  });
});

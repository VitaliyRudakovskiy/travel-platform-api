import { ServiceUnavailableException } from "@nestjs/common";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { HealthController } from "./health.controller";

const healthy = (service: string) => ({ [service]: { status: "up", checks: {} } });

describe("gateway HealthController", () => {
  const health = { check: vi.fn() };
  const downstream = { check: vi.fn() };
  const redis = { check: vi.fn() };
  const config = {
    get: vi.fn((name: string) =>
      name === "BOOKING_SERVICE_URL" ? "http://booking-service:3003" : undefined,
    ),
  };
  let controller: HealthController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new HealthController(
      health as never,
      downstream as never,
      redis as never,
      config as never,
    );
    // run the indicators like Terminus does
    health.check.mockImplementation(async (indicators: (() => Promise<object>)[]) => {
      const results = await Promise.all(indicators.map((run) => run()));
      return { status: "ok", info: Object.assign({}, ...results), error: {}, details: {} };
    });
    downstream.check.mockImplementation(async (service: string) => healthy(service));
    redis.check.mockResolvedValue({ status: "up" });
  });

  it("checks /health/ready of every downstream service", async () => {
    await controller.check();

    expect(downstream.check.mock.calls).toEqual([
      ["auth-service", "http://localhost:3001/health/ready"],
      ["catalog-service", "http://localhost:3002/health/ready"],
      ["booking-service", "http://booking-service:3003/health/ready"],
      ["notification-service", "http://localhost:3004/health/ready"],
    ]);
  });

  it("adds the Redis cache state to a healthy result", async () => {
    const result = await controller.check();

    expect(result.status).toBe("ok");
    expect(result.cache).toEqual({ redis: { status: "up" } });
  });

  it("stays 200 when only Redis is down", async () => {
    redis.check.mockResolvedValue({ status: "down", message: "Connection is closed", impact: "…" });

    await expect(controller.check()).resolves.toEqual(
      expect.objectContaining({
        status: "ok",
        cache: { redis: expect.objectContaining({ status: "down" }) },
      }),
    );
  });

  it("answers 503 with the failed services AND the cache section when a service is down", async () => {
    const terminusResult = { status: "error", error: { "booking-service": { status: "down" } } };
    health.check.mockRejectedValue(new ServiceUnavailableException(terminusResult));

    const error = await controller.check().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toEqual({
      ...terminusResult,
      cache: { redis: { status: "up" } },
    });
  });
});

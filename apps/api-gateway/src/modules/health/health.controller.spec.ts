import { describe, it, expect, vi } from "vitest";
import { HealthController } from "./health.controller";

describe("gateway HealthController", () => {
  it("pings /health/ready of every downstream service", async () => {
    const health = {
      check: vi.fn(async (indicators: (() => unknown)[]) =>
        Promise.all(indicators.map((run) => run())),
      ),
    };
    const http = { pingCheck: vi.fn().mockResolvedValue({}) };
    const config = {
      get: vi.fn((name: string) =>
        name === "BOOKING_SERVICE_URL" ? "http://booking-service:3003" : undefined,
      ),
    };
    const controller = new HealthController(health as never, http as never, config as never);

    await controller.check();

    expect(http.pingCheck.mock.calls.map(([key, url]) => [key, url])).toEqual([
      ["auth-service", "http://localhost:3001/health/ready"],
      ["catalog-service", "http://localhost:3002/health/ready"],
      ["booking-service", "http://booking-service:3003/health/ready"],
      ["notification-service", "http://localhost:3004/health/ready"],
    ]);
  });
});

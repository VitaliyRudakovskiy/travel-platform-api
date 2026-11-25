import { HealthIndicatorService } from "@nestjs/terminus";
import { of, throwError } from "rxjs";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { DownstreamHealthIndicator } from "./downstream-health.indicator";

const url = "http://booking-service:3003/health/ready";
const ownChecks = { postgres: { status: "up" }, rabbitmq: { status: "up" } };

describe("DownstreamHealthIndicator", () => {
  const http = { get: vi.fn() };
  let indicator: DownstreamHealthIndicator;

  beforeEach(() => {
    vi.resetAllMocks();
    indicator = new DownstreamHealthIndicator(http as never, new HealthIndicatorService());
  });

  it("is up with the service's own checks when it answers 200", async () => {
    http.get.mockReturnValue(
      of({ status: 200, data: { status: "ok", info: ownChecks, error: {}, details: ownChecks } }),
    );

    await expect(indicator.check("booking-service", url)).resolves.toEqual({
      "booking-service": { status: "up", checks: ownChecks },
    });
  });

  it("is down and shows which dependency failed when the service answers 503", async () => {
    const failed = {
      postgres: { status: "up" },
      rabbitmq: { status: "down", message: "RabbitMQ connection is down" },
    };
    // the service's GlobalExceptionFilter wraps the Terminus result into `details`
    http.get.mockReturnValue(
      of({
        status: 503,
        data: {
          statusCode: 503,
          error: "Service Unavailable",
          details: { status: "error", info: {}, error: {}, details: failed },
        },
      }),
    );

    await expect(indicator.check("booking-service", url)).resolves.toEqual({
      "booking-service": { status: "down", httpStatus: 503, checks: failed },
    });
  });

  it("is down when the service does not answer", async () => {
    http.get.mockReturnValue(
      throwError(() =>
        Object.assign(new Error("connect ECONNREFUSED"), {
          isAxiosError: true,
          code: "ECONNREFUSED",
        }),
      ),
    );

    await expect(indicator.check("booking-service", url)).resolves.toEqual({
      "booking-service": {
        status: "down",
        message: "booking-service is unreachable (ECONNREFUSED)",
      },
    });
  });
});

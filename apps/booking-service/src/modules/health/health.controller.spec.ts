import { describe, it, expect, vi } from "vitest";
import { HealthController } from "./health.controller";

describe("booking-service HealthController", () => {
  it("checks its own PostgreSQL and RabbitMQ", async () => {
    const health = {
      check: vi.fn(async (indicators: (() => unknown)[]) =>
        Promise.all(indicators.map((run) => run())),
      ),
    };
    const db = { pingCheck: vi.fn().mockResolvedValue({ postgres: { status: "up" } }) };
    const prisma = {};
    const rabbitmq = { isConnected: vi.fn().mockReturnValue({ rabbitmq: { status: "up" } }) };
    const controller = new HealthController(
      health as never,
      db as never,
      prisma as never,
      rabbitmq as never,
    );

    await controller.check();

    expect(db.pingCheck).toHaveBeenCalledWith("postgres", prisma);
    expect(rabbitmq.isConnected).toHaveBeenCalledOnce();
  });
});

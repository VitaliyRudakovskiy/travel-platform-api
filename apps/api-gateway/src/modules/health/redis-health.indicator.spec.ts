import { describe, it, expect, vi } from "vitest";
import { RedisHealthIndicator } from "./redis-health.indicator";

describe("RedisHealthIndicator", () => {
  it("is up when Redis answers PING", async () => {
    const indicator = new RedisHealthIndicator({
      ping: vi.fn().mockResolvedValue("PONG"),
    } as never);

    await expect(indicator.check()).resolves.toEqual({ status: "up" });
  });

  it("is down (with the impact) when Redis is unreachable", async () => {
    const indicator = new RedisHealthIndicator({
      ping: vi.fn().mockRejectedValue(new Error("Connection is closed.")),
    } as never);

    await expect(indicator.check()).resolves.toEqual({
      status: "down",
      message: "Connection is closed.",
      impact: "JWT claims are not cached: every request asks auth-service",
    });
  });
});

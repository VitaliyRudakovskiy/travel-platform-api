import { HealthIndicatorService } from "@nestjs/terminus";
import { describe, it, expect } from "vitest";
import { RabbitMqHealthIndicator } from "./rabbitmq.health";

describe("RabbitMqHealthIndicator", () => {
  const healthIndicatorService = new HealthIndicatorService();

  it("is up while the AMQP connection is established", () => {
    const indicator = new RabbitMqHealthIndicator(
      { connected: true } as never,
      healthIndicatorService,
    );

    expect(indicator.isConnected()).toEqual({ rabbitmq: { status: "up" } });
  });

  it("is down when the connection is lost", () => {
    const indicator = new RabbitMqHealthIndicator(
      { connected: false } as never,
      healthIndicatorService,
    );

    expect(indicator.isConnected()).toEqual({
      rabbitmq: { status: "down", message: "RabbitMQ connection is down" },
    });
  });
});

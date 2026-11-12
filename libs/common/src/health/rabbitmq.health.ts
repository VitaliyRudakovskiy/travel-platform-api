import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";

// spec 3.7: booking-service and notification-service report RabbitMQ availability in /health/ready.
// The connection is managed by amqp-connection-manager (auto-reconnect); `connected` is its live state.
@Injectable()
export class RabbitMqHealthIndicator {
  constructor(
    private readonly amqp: AmqpConnection,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  isConnected(key = "rabbitmq") {
    const indicator = this.healthIndicatorService.check(key);

    return this.amqp.connected
      ? indicator.up()
      : indicator.down({ message: "RabbitMQ connection is down" });
  }
}

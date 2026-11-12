import { Controller, Get, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from "@nestjs/terminus";
import { RabbitMqHealthIndicator } from "@app/common";
import { PrismaService } from "../../prisma/prisma.service";

// spec 3.7: own PostgreSQL + RabbitMQ; 200 when ready, 503 when a dependency is down
@ApiExcludeController()
@Controller({ path: "health", version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly rabbitmq: RabbitMqHealthIndicator,
  ) {}

  @Get("ready")
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck("postgres", this.prisma),
      () => this.rabbitmq.isConnected(),
    ]);
  }
}

import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { RabbitMqHealthIndicator } from "@app/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OutboxModule } from "../outbox/outbox.module";
import { HealthController } from "./health.controller";

// OutboxModule re-exports RabbitMQModule: the indicator checks the same AmqpConnection the service uses
@Module({
  imports: [TerminusModule, OutboxModule],
  controllers: [HealthController],
  providers: [PrismaService, RabbitMqHealthIndicator],
})
export class HealthModule {}

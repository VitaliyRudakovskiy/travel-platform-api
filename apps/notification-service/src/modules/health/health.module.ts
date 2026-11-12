import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { RabbitMqHealthIndicator } from "@app/common";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsModule } from "../events/events.module";
import { HealthController } from "./health.controller";

// EventsModule re-exports RabbitMQModule: the indicator checks the same AmqpConnection the service uses
@Module({
  imports: [TerminusModule, EventsModule],
  controllers: [HealthController],
  providers: [PrismaService, RabbitMqHealthIndicator],
})
export class HealthModule {}

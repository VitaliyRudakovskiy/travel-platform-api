import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TRAVEL_EVENTS_EXCHANGE } from "@app/contracts";
import { PrismaService } from "../../prisma/prisma.service";
import { OutboxService } from "./outbox.service";
import { OutboxWorker } from "./outbox.worker";

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("RABBITMQ_URL") ?? "amqp://guest:guest@localhost:5672",
        // topic exchange: routing key = event type ("booking.created", "booking.status_changed")
        exchanges: [{ name: TRAVEL_EVENTS_EXCHANGE, type: "topic", options: { durable: true } }],
        // Start even if RabbitMQ is down: bookings keep working, events wait in the outbox.
        connectionInitOptions: { wait: false },
        // booking-service only publishes: no @RabbitSubscribe handlers to discover
        registerHandlers: false,
      }),
    }),
  ],
  providers: [OutboxService, OutboxWorker, PrismaService],
  // re-exported for the RabbitMQ health check (RabbitMQModule is not global)
  exports: [RabbitMQModule],
})
export class OutboxModule {}

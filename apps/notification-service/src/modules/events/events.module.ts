import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TRAVEL_EVENTS_EXCHANGE } from "@app/contracts";
import { NotificationsModule } from "../v2/notifications/notifications.module";
import { BookingEventsConsumer } from "./booking-events.consumer";
import { NOTIFICATIONS_DLQ, NOTIFICATIONS_DLX } from "./events.constants";

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("RABBITMQ_URL") ?? "amqp://guest:guest@localhost:5672",
        exchanges: [
          // declared by both sides: whoever starts first creates it (same options, so no conflict)
          { name: TRAVEL_EVENTS_EXCHANGE, type: "topic", options: { durable: true } },
          { name: NOTIFICATIONS_DLX, type: "fanout", options: { durable: true } },
        ],
        queues: [
          {
            name: NOTIFICATIONS_DLQ,
            exchange: NOTIFICATIONS_DLX,
            routingKey: "",
            options: { durable: true },
          },
        ],
        // One message at a time: a slow DB doesn't pile up unacknowledged deliveries in this process
        prefetchCount: 1,
        // Start even if RabbitMQ is down; the subscription is set up when the connection comes up
        connectionInitOptions: { wait: false },
      }),
    }),
    NotificationsModule,
  ],
  providers: [BookingEventsConsumer],
})
export class EventsModule {}

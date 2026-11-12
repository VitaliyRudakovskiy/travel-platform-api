import { MessageHandlerErrorBehavior, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { bookingEventSchema, BookingEventType, TRAVEL_EVENTS_EXCHANGE } from "@app/contracts";
import { NotificationsService } from "../v2/notifications/notifications.service";
import { NOTIFICATIONS_DLX, NOTIFICATIONS_QUEUE } from "./events.constants";

@Injectable()
export class BookingEventsConsumer {
  private readonly logger = new Logger(BookingEventsConsumer.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  // Returning normally = ACK. Throwing = NACK without requeue -> the message goes to the dead-letter queue
  // (a poison message would otherwise be redelivered in an endless loop).
  @RabbitSubscribe({
    exchange: TRAVEL_EVENTS_EXCHANGE,
    routingKey: [BookingEventType.created, BookingEventType.statusChanged],
    queue: NOTIFICATIONS_QUEUE,
    queueOptions: { durable: true, deadLetterExchange: NOTIFICATIONS_DLX },
    errorBehavior: MessageHandlerErrorBehavior.NACK,
  })
  async handle(message: unknown): Promise<void> {
    const parsed = bookingEventSchema.safeParse(message);

    if (!parsed.success) {
      this.logger.error(`Invalid booking event dead-lettered: ${parsed.error.message}`);
      throw parsed.error;
    }

    const event = parsed.data;
    const created = await this.notificationsService.createFromBookingEvent(event);

    if (created === 0) {
      this.logger.log(
        `Event ${event.eventId} (${event.type}) already processed: duplicate ignored`,
      );
      return;
    }

    this.logger.log(`Event ${event.eventId} (${event.type}): ${created} notifications created`);
  }
}

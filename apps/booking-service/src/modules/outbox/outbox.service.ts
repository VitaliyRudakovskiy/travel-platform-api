import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { TRAVEL_EVENTS_EXCHANGE } from "@app/contracts";
import { type OutboxEvent, OutboxEventType, OutboxStatus } from "#booking-prisma";
import { PrismaService } from "../../prisma/prisma.service";
import {
  OUTBOX_BATCH_SIZE,
  OUTBOX_MAX_ATTEMPTS,
  OUTBOX_PUBLISH_TIMEOUT_MS,
} from "./outbox.constants";

// Prisma enum names can't contain a dot; the routing key is the real event name.
const ROUTING_KEYS: Record<OutboxEventType, string> = {
  [OutboxEventType.booking_created]: "booking.created",
  [OutboxEventType.booking_status_changed]: "booking.status_changed",
};

type PublishOptions = Parameters<AmqpConnection["publish"]>[3];

export type OutboxRunResult = { published: number; failed: number; skipped: boolean };

/**
 * Publishing side of the Transactional Outbox: reads `pending` rows and sends them to RabbitMQ.
 * The row is marked `published` only AFTER the broker confirmed the message (publisher confirms),
 * so a crash between the two steps re-sends the event: delivery is at-least-once,
 * and consumers deduplicate by `eventId` (= row id = AMQP messageId).
 */
@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly amqp: AmqpConnection,
  ) {}

  async publishPendingEvents(): Promise<OutboxRunResult> {
    // Broker down: keep everything pending and don't spend attempts; the next tick tries again.
    if (!this.amqp.connected) {
      return { published: 0, failed: 0, skipped: true };
    }

    // Oldest first: events of one booking are published in the order they happened.
    // A single worker instance is assumed; several would need SELECT ... FOR UPDATE SKIP LOCKED.
    const events = await this.prisma.outboxEvent.findMany({
      where: { status: OutboxStatus.pending },
      orderBy: { createdAt: "asc" },
      take: OUTBOX_BATCH_SIZE,
    });

    let published = 0;
    let failed = 0;

    for (const event of events) {
      if (await this.publish(event)) {
        published++;
      } else {
        failed++;
      }
    }

    return { published, failed, skipped: false };
  }

  private async publish(event: OutboxEvent): Promise<boolean> {
    try {
      await this.amqp.publish(
        TRAVEL_EVENTS_EXCHANGE,
        ROUTING_KEYS[event.eventType],
        event.payload,
        {
          messageId: event.id,
          persistent: true, // survives a broker restart (the exchange/queues are durable)
          contentType: "application/json",
          timestamp: Math.floor(event.createdAt.getTime() / 1000),
          // option of amqp-connection-manager, not part of the amqplib type
          timeout: OUTBOX_PUBLISH_TIMEOUT_MS,
        } as PublishOptions,
      );
    } catch (error) {
      const attempts = event.attempts + 1;
      const giveUp = attempts >= OUTBOX_MAX_ATTEMPTS;

      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: { attempts, ...(giveUp ? { status: OutboxStatus.failed } : {}) },
      });

      this.logger.error(
        `Outbox event ${event.id} (${ROUTING_KEYS[event.eventType]}) publish failed, attempt ${attempts}` +
          `${giveUp ? " -> failed" : ""}: ${error instanceof Error ? error.message : String(error)}`,
      );

      return false;
    }

    await this.prisma.outboxEvent.update({
      where: { id: event.id },
      data: { status: OutboxStatus.published, publishedAt: new Date() },
    });

    return true;
  }
}

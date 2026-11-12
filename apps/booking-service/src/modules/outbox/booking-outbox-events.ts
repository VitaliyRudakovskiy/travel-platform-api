import { randomUUID } from "node:crypto";
import {
  type BookingCreatedEvent,
  BookingEventType,
  type BookingStatusChangedEvent,
} from "@app/contracts";
import { type BookingStatus, OutboxEventType, type Prisma } from "#booking-prisma";

type BookingSnapshot = {
  id: string;
  userId: string;
  offerId: string;
  offerOwnerId: string;
  startDate: Date;
  endDate: Date;
  guestsCount: number;
  totalPrice: Prisma.Decimal | number;
  status: BookingStatus;
};

// Rows for `tx.outboxEvent.create({ data })`: written in the SAME transaction as the booking change
// (Transactional Outbox). The row id doubles as `eventId` so consumers can deduplicate redeliveries.

export function bookingCreatedOutboxEvent(
  booking: BookingSnapshot,
  offerTitle: string,
): Prisma.OutboxEventCreateInput {
  const eventId = randomUUID();
  const payload: BookingCreatedEvent = {
    type: BookingEventType.created,
    eventId,
    bookingId: booking.id,
    userId: booking.userId,
    offerId: booking.offerId,
    offerOwnerId: booking.offerOwnerId,
    offerTitle,
    status: booking.status,
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    guestsCount: booking.guestsCount,
    totalPrice: Number(booking.totalPrice),
    occurredAt: new Date().toISOString(),
  };

  return { id: eventId, eventType: OutboxEventType.booking_created, payload };
}

export function bookingStatusChangedOutboxEvent(
  booking: Pick<BookingSnapshot, "id" | "userId" | "offerId" | "offerOwnerId">,
  fromStatus: BookingStatus,
  toStatus: BookingStatus,
  offerTitle: string | undefined,
): Prisma.OutboxEventCreateInput {
  const eventId = randomUUID();
  const payload: BookingStatusChangedEvent = {
    type: BookingEventType.statusChanged,
    eventId,
    bookingId: booking.id,
    userId: booking.userId,
    offerId: booking.offerId,
    offerOwnerId: booking.offerOwnerId,
    offerTitle,
    fromStatus,
    toStatus,
    occurredAt: new Date().toISOString(),
  };

  return { id: eventId, eventType: OutboxEventType.booking_status_changed, payload };
}

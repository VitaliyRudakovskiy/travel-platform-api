import z from "zod";

// Events published by booking-service through the Transactional Outbox (exchange `travel.events`,
// routing key = event type) and consumed by notification-service (queue `travel.notifications`).
// `eventId` = id of the OutboxEvent row: consumers use it to drop duplicates (delivery is at-least-once).
export const BookingEventType = {
  created: "booking.created",
  statusChanged: "booking.status_changed",
} as const;
export type BookingEventType = (typeof BookingEventType)[keyof typeof BookingEventType];

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

const bookingEventBaseSchema = z.object({
  eventId: z.uuid(),
  bookingId: z.uuid(),
  userId: z.uuid(),
  offerId: z.uuid(),
  offerOwnerId: z.uuid(),
  occurredAt: z.iso.datetime(),
});

export const bookingCreatedEventSchema = bookingEventBaseSchema.extend({
  type: z.literal(BookingEventType.created),
  offerTitle: z.string(),
  status: z.enum(BOOKING_STATUSES),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  guestsCount: z.number().int(),
  totalPrice: z.number(),
});
export type BookingCreatedEvent = z.infer<typeof bookingCreatedEventSchema>;

export const bookingStatusChangedEventSchema = bookingEventBaseSchema.extend({
  type: z.literal(BookingEventType.statusChanged),
  // best effort: read from catalog-service, absent if it was unavailable (a status change must not depend on it)
  offerTitle: z.string().optional(),
  fromStatus: z.enum(BOOKING_STATUSES),
  toStatus: z.enum(BOOKING_STATUSES),
});
export type BookingStatusChangedEvent = z.infer<typeof bookingStatusChangedEventSchema>;

export const bookingEventSchema = z.discriminatedUnion("type", [
  bookingCreatedEventSchema,
  bookingStatusChangedEventSchema,
]);
export type BookingEvent = z.infer<typeof bookingEventSchema>;

import { ZodError } from "zod";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { type NotificationsService } from "../v2/notifications/notifications.service";
import { BookingEventsConsumer } from "./booking-events.consumer";

const validEvent = {
  type: "booking.status_changed",
  eventId: faker.string.uuid(),
  bookingId: faker.string.uuid(),
  userId: faker.string.uuid(),
  offerId: faker.string.uuid(),
  offerOwnerId: faker.string.uuid(),
  occurredAt: "2026-11-12T10:00:00.000Z",
  fromStatus: "pending",
  toStatus: "confirmed",
};

describe("BookingEventsConsumer", () => {
  const notificationsService = { createFromBookingEvent: vi.fn() };
  let consumer: BookingEventsConsumer;

  beforeEach(() => {
    vi.resetAllMocks();
    consumer = new BookingEventsConsumer(notificationsService as unknown as NotificationsService);
  });

  it("validates the message and creates notifications (ACK)", async () => {
    notificationsService.createFromBookingEvent.mockResolvedValue(2);

    await expect(consumer.handle(validEvent)).resolves.toBeUndefined();
    expect(notificationsService.createFromBookingEvent).toHaveBeenCalledWith(validEvent);
  });

  it("acknowledges a duplicate delivery without creating anything", async () => {
    notificationsService.createFromBookingEvent.mockResolvedValue(0);

    await expect(consumer.handle(validEvent)).resolves.toBeUndefined();
  });

  it.each([
    ["an unknown event type", { ...validEvent, type: "booking.deleted" }],
    ["a missing eventId", { ...validEvent, eventId: undefined }],
    ["not an object", "garbage"],
  ])(
    "throws for %s, so the message is NACKed into the dead-letter queue",
    async (_case, message) => {
      await expect(consumer.handle(message)).rejects.toBeInstanceOf(ZodError);
      expect(notificationsService.createFromBookingEvent).not.toHaveBeenCalled();
    },
  );

  it("throws (dead-letter) when storing fails", async () => {
    notificationsService.createFromBookingEvent.mockRejectedValue(new Error("notify_db is down"));

    await expect(consumer.handle(validEvent)).rejects.toThrow("notify_db is down");
  });
});

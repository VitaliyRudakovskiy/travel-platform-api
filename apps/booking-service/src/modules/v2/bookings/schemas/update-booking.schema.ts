import { BookingStatus } from "#booking-prisma";
import z from "zod";

export const v2UpdateBookingStatusSchema = z.object({
  status: z.enum(
    [BookingStatus.confirmed, BookingStatus.completed, BookingStatus.cancelled],
    `Status must be '${BookingStatus.confirmed}', '${BookingStatus.completed}' or '${BookingStatus.cancelled}'`,
  ),
});

export type V2UpdateBookingStatusDto = z.infer<typeof v2UpdateBookingStatusSchema>;

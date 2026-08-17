import { BookingStatus } from "@prisma/client";
import z from "zod";

export const updateBookingStatusSchema = z.object({
  status: z.enum(
    [BookingStatus.confirmed, BookingStatus.cancelled],
    `Status must be '${BookingStatus.confirmed}' or '${BookingStatus.cancelled}'`,
  ),
});

export type UpdateBookingStatusDto = z.infer<typeof updateBookingStatusSchema>;

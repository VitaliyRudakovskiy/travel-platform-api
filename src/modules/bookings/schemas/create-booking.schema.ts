import z from "zod";
import { MIN_GUESTS_COUNT } from "../models/schema.constants";

export const createBookingSchema = z
  .object({
    offerId: z.uuid("Invalid offer ID format"),
    startDate: z.iso.datetime("Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"),
    endDate: z.iso.datetime("Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)"),
    guestsCount: z
      .number()
      .int("Guests count must be an integer")
      .min(MIN_GUESTS_COUNT, `Guests count must be at least ${MIN_GUESTS_COUNT}`),
  })
  .strict();

export type CreateBookingDto = z.infer<typeof createBookingSchema>;

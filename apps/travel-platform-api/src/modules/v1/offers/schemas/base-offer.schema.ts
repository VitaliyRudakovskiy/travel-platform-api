import z from "zod";
import {
  MAX_CONCURRENT_BOOKINGS_MAX_VALUE,
  MAX_CONCURRENT_BOOKINGS_MIN_VALUE,
  MAX_GUESTS_MAX_VALUE,
  MAX_GUESTS_MIN_VALUE,
  PRICE_MAX_VALUE,
  PRICE_MIN_VALUE,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "../models/schema.constants";

export const baseOfferSchema = z.object({
  type: z.enum(["hotel", "flight", "tour"], {
    error: "Type must be 'hotel', 'flight', or 'tour'",
  }),

  destinationId: z.uuid("Invalid destination ID format"),

  title: z
    .string()
    .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
    .max(TITLE_MAX_LENGTH, `Title must not exceed ${TITLE_MAX_LENGTH} characters`),

  description: z.string().optional().nullable(),

  price: z
    .number()
    .min(PRICE_MIN_VALUE, `Price must be at least ${PRICE_MIN_VALUE}`)
    .max(PRICE_MAX_VALUE, `Price must not exceed ${PRICE_MAX_VALUE}`)
    .multipleOf(PRICE_MIN_VALUE, "Price must have at most 2 decimal places"),

  currency: z.enum(["BYN", "USD", "EUR"], {
    error: "Currency must be 'BYN', 'USD', or 'EUR'",
  }),

  maxGuests: z
    .number()
    .int("Max guests must be an integer")
    .min(MAX_GUESTS_MIN_VALUE, `Max guests must be at least ${MAX_GUESTS_MIN_VALUE}`)
    .max(MAX_GUESTS_MAX_VALUE, `Max guests must not exceed ${MAX_GUESTS_MAX_VALUE}`),

  maxConcurrentBookings: z
    .number()
    .int("Max concurrent bookings must be an integer")
    .min(
      MAX_CONCURRENT_BOOKINGS_MIN_VALUE,
      `Max concurrent bookings must be at least ${MAX_CONCURRENT_BOOKINGS_MIN_VALUE}`,
    )
    .max(
      MAX_CONCURRENT_BOOKINGS_MAX_VALUE,
      `Max concurrent bookings must not exceed ${MAX_CONCURRENT_BOOKINGS_MAX_VALUE}`,
    ),

  availableFrom: z.iso.datetime({
    message: "Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)",
  }),

  availableTo: z.iso.datetime({
    message: "Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)",
  }),

  status: z.enum(["active", "archived"]).optional().default("active"),
});

export type BaseOfferDto = z.infer<typeof baseOfferSchema>;

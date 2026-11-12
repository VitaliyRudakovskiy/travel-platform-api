import z from "zod";
import {
  ADDRESS_MAX_LENGTH,
  AIRLINE_MAX_LENGTH,
  DURATION_DAYS_MAX_VALUE,
  DURATION_DAYS_MIN_VALUE,
  FLIGHT_NUMBER_MAX_LENGTH,
  STARS_MAX_VALUE,
  STARS_MIN_VALUE,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  PRICE_MAX_VALUE,
  PRICE_MIN_VALUE,
  MAX_GUESTS_MIN_VALUE,
  MAX_GUESTS_MAX_VALUE,
  MAX_CONCURRENT_BOOKINGS_MIN_VALUE,
  MAX_CONCURRENT_BOOKINGS_MAX_VALUE,
} from "../models/schema.constants";

export const updateOfferSchema = z
  .object({
    type: z.enum(["hotel", "flight", "tour"]).optional(),

    destinationId: z.uuid("Invalid destination ID format").optional(),

    title: z
      .string()
      .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
      .max(TITLE_MAX_LENGTH, `Title must not exceed ${TITLE_MAX_LENGTH} characters`)
      .optional(),

    description: z.string().optional().nullable(),

    price: z
      .number()
      .min(PRICE_MIN_VALUE, `Price must be at least ${PRICE_MIN_VALUE}`)
      .max(PRICE_MAX_VALUE, `Price must not exceed ${PRICE_MAX_VALUE}`)
      .multipleOf(0.01, "Price must have at most 2 decimal places")
      .optional(),

    currency: z.enum(["BYN", "USD", "EUR"]).optional(),

    maxGuests: z
      .number()
      .int("Max guests must be an integer")
      .min(MAX_GUESTS_MIN_VALUE, `Max guests must be at least ${MAX_GUESTS_MIN_VALUE}`)
      .max(MAX_GUESTS_MAX_VALUE, `Max guests must not exceed ${MAX_GUESTS_MAX_VALUE}`)
      .optional(),

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
      )
      .optional(),

    availableFrom: z.iso.datetime({ message: "Invalid date format. Use ISO 8601" }).optional(),

    availableTo: z.iso.datetime({ message: "Invalid date format. Use ISO 8601" }).optional(),

    status: z.enum(["active", "archived"]).optional(),

    stars: z
      .number()
      .int("Stars must be an integer")
      .min(STARS_MIN_VALUE, `Stars must be at least ${STARS_MIN_VALUE}`)
      .max(STARS_MAX_VALUE, `Stars must not exceed ${STARS_MAX_VALUE}`)
      .optional(),

    address: z
      .string()
      .min(1, "Address is required for hotels")
      .max(ADDRESS_MAX_LENGTH, `Address must not exceed ${ADDRESS_MAX_LENGTH} characters`)
      .optional(),

    flightNumber: z
      .string()
      .min(1, "Flight number is required for flights")
      .max(
        FLIGHT_NUMBER_MAX_LENGTH,
        `Flight number must not exceed ${FLIGHT_NUMBER_MAX_LENGTH} characters`,
      )
      .optional(),

    airline: z
      .string()
      .min(1, "Airline is required for flights")
      .max(AIRLINE_MAX_LENGTH, `Airline must not exceed ${AIRLINE_MAX_LENGTH} characters`)
      .optional(),

    durationDays: z
      .number()
      .int("Duration days must be an integer")
      .min(DURATION_DAYS_MIN_VALUE, `Duration must be at least ${DURATION_DAYS_MIN_VALUE} day`)
      .max(DURATION_DAYS_MAX_VALUE, `Duration must not exceed ${DURATION_DAYS_MAX_VALUE} days`)
      .optional(),

    includesMeals: z.boolean().optional().nullable(),
  })
  .strict();

export type UpdateOfferDto = z.infer<typeof updateOfferSchema>;

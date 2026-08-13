import z from "zod";
import {
  ADDRESS_MAX_LENGTH,
  AIRLINE_MAX_LENGTH,
  DURATION_DAYS_MAX_VALUE,
  DURATION_DAYS_MIN_VALUE,
  FLIGHT_NUMBER_MAX_LENGTH,
  STARS_MAX_VALUE,
  STARS_MIN_VALUE,
} from "../models/schema.constants";
import { baseOfferSchema } from "./base-offer-schema";

const hotelFields = z.object({
  type: z.literal("hotel"),

  stars: z
    .number()
    .int("Stars must be an integer")
    .min(STARS_MIN_VALUE, `Stars must be at least ${STARS_MIN_VALUE}`)
    .max(STARS_MAX_VALUE, `Stars must not exceed ${STARS_MAX_VALUE}`),

  address: z
    .string()
    .min(1, "Address is required for hotels")
    .max(ADDRESS_MAX_LENGTH, `Address must not exceed ${ADDRESS_MAX_LENGTH} characters`),

  flightNumber: z.undefined().optional(),
  airline: z.undefined().optional(),
  durationDays: z.undefined().optional(),
  includesMeals: z.undefined().optional(),
});

const flightFields = z.object({
  type: z.literal("flight"),

  flightNumber: z
    .string()
    .min(1, "Flight number is required for flights")
    .max(
      FLIGHT_NUMBER_MAX_LENGTH,
      `Flight number must not exceed ${FLIGHT_NUMBER_MAX_LENGTH} characters`,
    ),

  airline: z
    .string()
    .min(1, "Airline is required for flights")
    .max(AIRLINE_MAX_LENGTH, `Airline must not exceed ${AIRLINE_MAX_LENGTH} characters`),

  stars: z.undefined().optional(),
  address: z.undefined().optional(),
  durationDays: z.undefined().optional(),
  includesMeals: z.undefined().optional(),
});

const tourFields = z.object({
  type: z.literal("tour"),

  durationDays: z
    .number()
    .int("Duration days must be an integer")
    .min(DURATION_DAYS_MIN_VALUE, `Duration must be at least ${DURATION_DAYS_MIN_VALUE} day`)
    .max(DURATION_DAYS_MAX_VALUE, `Duration must not exceed ${DURATION_DAYS_MAX_VALUE} days`),

  includesMeals: z.boolean().optional().default(false),

  stars: z.undefined().optional(),
  address: z.undefined().optional(),
  airline: z.undefined().optional(),
  flightNumber: z.undefined().optional(),
});

const hotelSchema = baseOfferSchema.extend(hotelFields.shape);
const flightSchema = baseOfferSchema.extend(flightFields.shape);
const tourSchema = baseOfferSchema.extend(tourFields.shape);

export const createOfferSchema = z.discriminatedUnion("type", [
  hotelSchema,
  flightSchema,
  tourSchema,
]);

export type CreateOfferDto = z.infer<typeof createOfferSchema>;

import z from "zod";
import {
  DESTINATION_MAX_LENGTH,
  DESTINATION_MIN_LENGTH,
  COUNTRY_CODE_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from "../models/schema.constants";

export const createDestinationSchema = z.object({
  name: z
    .string()
    .min(
      DESTINATION_MIN_LENGTH,
      `Destination name must be at least ${DESTINATION_MIN_LENGTH} characters`,
    )
    .max(
      DESTINATION_MAX_LENGTH,
      `Destination name must not exceed ${DESTINATION_MAX_LENGTH} characters`,
    ),

  countryCode: z
    .string()
    .length(COUNTRY_CODE_LENGTH, `Country code must be exactly ${COUNTRY_CODE_LENGTH} characters`)
    .regex(/^[A-Z]{2}$/, "Country code must be in ISO 3166-1 alpha-2 format (e.g., BY, PL, US)"),

  description: z
    .string()
    .max(DESCRIPTION_MAX_LENGTH, `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`)
    .optional()
    .nullable(),
});

export type CreateDestinationDto = z.infer<typeof createDestinationSchema>;

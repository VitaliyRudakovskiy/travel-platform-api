import z from "zod";
import {
  COUNTRY_CODE_LENGTH,
  LIMIT_MAX_VALUE,
  LIMIT_MIN_VALUE,
  PAGE_MIN_VALUE,
} from "../models/schema.constants";

export const destinationQuerySchema = z.object({
  // Пагинация
  page: z
    .string()
    .optional()
    .default("1")
    .transform((value) => parseInt(value, 10))
    .pipe(z.number().min(PAGE_MIN_VALUE, `Page must be at least ${PAGE_MIN_VALUE}`)),

  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(LIMIT_MIN_VALUE, `Limit must be at least ${LIMIT_MIN_VALUE}`)
        .max(LIMIT_MAX_VALUE, `Limit must not exceed ${LIMIT_MAX_VALUE}`),
    ),

  // Фильтрация
  name: z
    .string()
    .optional()
    .transform((val) => val?.trim()),

  countryCode: z
    .string()
    .length(COUNTRY_CODE_LENGTH, `Country code must be exactly ${COUNTRY_CODE_LENGTH} characters`)
    .regex(/^[A-Z]{2}$/, "Country code must be in ISO 3166-1 alpha-2 format")
    .optional()
    .transform((val) => val?.toUpperCase()),
});

export type DestinationQueryDto = z.infer<typeof destinationQuerySchema>;

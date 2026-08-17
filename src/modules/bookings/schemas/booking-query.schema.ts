import z from "zod";
import { LIMIT_MAX_VALUE, LIMIT_MIN_VALUE, PAGE_MIN_VALUE } from "../models/schema.constants";
import { BookingStatus } from "@prisma/client";

export const bookingQuerySchema = z.object({
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

  status: z
    .enum([BookingStatus.cancelled, BookingStatus.confirmed, BookingStatus.draft])
    .optional(),
});

export type BookingQueryDto = z.infer<typeof bookingQuerySchema>;

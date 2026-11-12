import z from "zod";
import {
  ANALYTICS_LIMIT_DEFAULT,
  ANALYTICS_LIMIT_MAX,
  ANALYTICS_LIMIT_MIN,
  BOOKING_ANALYTICS_GROUP_BY,
} from "../models/analytics.constants";

export const bookingAnalyticsQuerySchema = z
  .object({
    from: z.iso.date("from must be a date in YYYY-MM-DD format"),

    to: z.iso.date("to must be a date in YYYY-MM-DD format"),

    groupBy: z.enum(BOOKING_ANALYTICS_GROUP_BY),

    limit: z
      .string()
      .optional()
      .default(String(ANALYTICS_LIMIT_DEFAULT))
      .transform((value) => parseInt(value, 10))
      .pipe(
        z
          .number()
          .min(ANALYTICS_LIMIT_MIN, `Limit must be at least ${ANALYTICS_LIMIT_MIN}`)
          .max(ANALYTICS_LIMIT_MAX, `Limit must not exceed ${ANALYTICS_LIMIT_MAX}`),
      ),
  })
  .refine(({ from, to }) => from <= to, {
    message: "from must not be later than to",
    path: ["from"],
  });

export type BookingAnalyticsQueryDto = z.infer<typeof bookingAnalyticsQuerySchema>;

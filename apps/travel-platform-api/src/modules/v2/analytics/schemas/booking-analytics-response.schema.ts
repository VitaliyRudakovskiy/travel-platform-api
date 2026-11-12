import z from "zod";
import { BOOKING_ANALYTICS_GROUP_BY } from "../models/analytics.constants";

export const bookingAnalyticsItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  count: z.number().int(),
});

export const bookingAnalyticsResponseSchema = z.object({
  groupBy: z.enum(BOOKING_ANALYTICS_GROUP_BY),
  from: z.iso.date(),
  to: z.iso.date(),
  data: z.array(bookingAnalyticsItemSchema),
});

export type BookingAnalyticsItemDto = z.infer<typeof bookingAnalyticsItemSchema>;
export type BookingAnalyticsResponseDto = z.infer<typeof bookingAnalyticsResponseSchema>;

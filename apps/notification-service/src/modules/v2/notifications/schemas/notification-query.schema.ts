import z from "zod";
import { NotificationStatus, NotificationType } from "#notify-prisma";
import { LIMIT_MAX_VALUE, LIMIT_MIN_VALUE, PAGE_MIN_VALUE } from "../models/pagination.constants";

export const notificationQuerySchema = z.object({
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
    .transform((value) => parseInt(value, 10))
    .pipe(
      z
        .number()
        .min(LIMIT_MIN_VALUE, `Limit must be at least ${LIMIT_MIN_VALUE}`)
        .max(LIMIT_MAX_VALUE, `Limit must not exceed ${LIMIT_MAX_VALUE}`),
    ),

  type: z.enum(NotificationType).optional(),

  status: z.enum(NotificationStatus).optional(),
});

export type NotificationQueryDto = z.infer<typeof notificationQuerySchema>;

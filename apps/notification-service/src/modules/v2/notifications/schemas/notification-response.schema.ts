import z from "zod";
import { NotificationChannel, NotificationStatus, NotificationType } from "#notify-prisma";

export const notificationResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  bookingId: z.uuid().nullable(),
  type: z.enum(NotificationType),
  channel: z.enum(NotificationChannel),
  status: z.enum(NotificationStatus),
  payload: z.record(z.string(), z.unknown()),
  errorMessage: z.string().nullable(),
  createdAt: z.date(),
  sentAt: z.date().nullable(),
});

export type NotificationResponseDto = z.infer<typeof notificationResponseSchema>;

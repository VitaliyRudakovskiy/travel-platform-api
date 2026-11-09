import { NotificationType } from "#prisma";

export const NOTIFICATIONS_WORKER_INTERVAL_MS = 10_000;
export const NOTIFICATIONS_BATCH_SIZE = 20;

export const DEFAULT_SMTP_HOST = "localhost";
export const DEFAULT_SMTP_PORT = 1025;
export const DEFAULT_MAIL_FROM = "no-reply@travel-platform.local";

export const NOTIFICATION_SUBJECTS: Record<NotificationType, string> = {
  [NotificationType.email_verification]: "Confirm your email",
  [NotificationType.booking_confirmed]: "Your booking is confirmed",
  [NotificationType.booking_cancelled]: "Your booking is cancelled",
  [NotificationType.booking_completed]: "Your booking is completed",
};

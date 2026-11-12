import z from "zod";

// POST /internal/v1/notifications/email-verification (notification-service), called by auth-service
// after it stored the hashed token. The raw token only travels to the email.
export const emailVerificationNotificationSchema = z.object({
  userId: z.uuid(),
  email: z.email(),
  token: z.string().min(1),
});
export type EmailVerificationNotificationDto = z.infer<typeof emailVerificationNotificationSchema>;

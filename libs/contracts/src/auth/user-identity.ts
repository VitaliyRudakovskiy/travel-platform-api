import z from "zod";

// GET /internal/v1/users/:id (auth-service) — read by the API Gateway (JWT claims) and notification-service (email)
export const userIdentitySchema = z.object({
  id: z.uuid(),
  email: z.string(),
  role: z.enum(["Admin", "Agent", "User"]),
  isEmailVerified: z.boolean(),
});
export type UserIdentityDto = z.infer<typeof userIdentitySchema>;

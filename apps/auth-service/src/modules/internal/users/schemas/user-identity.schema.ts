import z from "zod";
import { USER_ROLES } from "@app/common";

// Internal contract (GET /internal/v1/users/:id) for the API Gateway (JWT claims) and notification-service (email).
export const userIdentitySchema = z.object({
  id: z.uuid(),
  email: z.string(),
  role: z.enum(USER_ROLES),
  isEmailVerified: z.boolean(),
});

export type UserIdentityDto = z.infer<typeof userIdentitySchema>;

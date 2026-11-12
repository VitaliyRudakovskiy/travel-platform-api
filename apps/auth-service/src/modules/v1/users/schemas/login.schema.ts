import z from "zod";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../models/schema.constants";

export const loginSchema = z.object({
  email: z
    .email("Invalid email format")
    .min(EMAIL_MIN_LENGTH, `Email must be at least ${EMAIL_MIN_LENGTH} characters`)
    .max(EMAIL_MAX_LENGTH, `Email must not exceed ${EMAIL_MAX_LENGTH} characters`),

  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`),
});

export type LoginDto = z.infer<typeof loginSchema>;

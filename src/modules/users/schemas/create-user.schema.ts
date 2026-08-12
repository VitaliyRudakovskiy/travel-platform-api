import z from "zod";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 50;
const EMAIL_MIN_LENGTH = 6;
const EMAIL_MAX_LENGTH = 70;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 32;

export const createUserSchema = z.object({
  id: z.uuid("Invalid UUID format"),

  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
    .max(USERNAME_MAX_LENGTH, `Username must not exceed ${USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),

  email: z
    .email("Invalid email format")
    .min(EMAIL_MIN_LENGTH, `Email must be at least ${EMAIL_MIN_LENGTH} characters`)
    .max(EMAIL_MAX_LENGTH, `Email must not exceed ${EMAIL_MAX_LENGTH} characters`),

  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

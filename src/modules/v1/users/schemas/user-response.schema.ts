import z from "zod";

export const userResponseSchema = z.object({
  id: z.uuid(),
  username: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserResponseDto = z.infer<typeof userResponseSchema>;

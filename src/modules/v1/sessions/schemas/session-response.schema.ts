import z from "zod";

export const sessionResponseSchema = z.object({
  userId: z.uuid(),
  username: z.string(),
  email: z.email(),
  createdAt: z.date(),
});

export type SessionResponseDto = z.infer<typeof sessionResponseSchema>;

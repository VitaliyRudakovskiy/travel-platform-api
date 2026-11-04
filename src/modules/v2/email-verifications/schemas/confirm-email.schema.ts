import z from "zod";

export const confirmEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export type ConfirmEmailDto = z.infer<typeof confirmEmailSchema>;

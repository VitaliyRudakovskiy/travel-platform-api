import { Currency } from "#prisma";
import z from "zod";

export const profileResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  preferredCurrency: z.enum([Currency.BYN, Currency.USD, Currency.EUR]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProfileResponseDto = z.infer<typeof profileResponseSchema>;

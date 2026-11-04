import { Currency } from "#prisma";
import z from "zod";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
} from "../models/profile.constants";

export const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .max(FIRST_NAME_MAX_LENGTH, `First name must not exceed ${FIRST_NAME_MAX_LENGTH} characters`)
      .nullable()
      .optional(),
    lastName: z
      .string()
      .max(LAST_NAME_MAX_LENGTH, `Last name must not exceed ${LAST_NAME_MAX_LENGTH} characters`)
      .nullable()
      .optional(),
    phone: z
      .string()
      .max(PHONE_MAX_LENGTH, `Phone must not exceed ${PHONE_MAX_LENGTH} characters`)
      .nullable()
      .optional(),
    preferredCurrency: z
      .enum([Currency.BYN, Currency.USD, Currency.EUR], {
        error: "Currency must be 'BYN', 'USD', or 'EUR'",
      })
      .optional(),
  })
  .refine(
    (data) =>
      data.firstName !== undefined ||
      data.lastName !== undefined ||
      data.phone !== undefined ||
      data.preferredCurrency !== undefined,
    { error: "At least one field is required" },
  );

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

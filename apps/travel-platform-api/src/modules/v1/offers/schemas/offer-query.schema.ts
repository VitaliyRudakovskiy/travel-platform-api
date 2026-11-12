import z from "zod";
import { LIMIT_MAX_VALUE, LIMIT_MIN_VALUE, PAGE_MIN_VALUE } from "../models/schema.constants";

export const offerQuerySchema = z.object({
  // Пагинация
  page: z
    .string()
    .optional()
    .default("1")
    .transform((value) => parseInt(value, 10))
    .pipe(z.number().min(PAGE_MIN_VALUE, `Page must be at least ${PAGE_MIN_VALUE}`)),

  limit: z
    .string()
    .optional()
    .default("10")
    .transform((value) => parseInt(value, 10))
    .pipe(
      z
        .number()
        .min(LIMIT_MIN_VALUE, `Limit must be at least ${LIMIT_MIN_VALUE}`)
        .max(LIMIT_MAX_VALUE, `Limit must be at least ${LIMIT_MAX_VALUE}`),
    ),

  // Фильтры
  type: z.enum(["hotel", "flight", "tour"]).optional(),

  destinationId: z.uuid("Invalid destination ID format").optional(),

  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(0, "Min price must be at least 0").optional()),

  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .pipe(z.number().min(0, "Max price must be at least 0").optional()),

  availableFrom: z.iso.datetime({ message: "Invalid date format. Use ISO 8601" }).optional(),

  availableTo: z.iso.datetime({ message: "Invalid date format. Use ISO 8601" }).optional(),

  status: z.enum(["active", "archived"]).optional().default("active"),

  // Сортировка
  sortBy: z.enum(["price", "createdAt"]).optional().default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type OfferQueryDto = z.infer<typeof offerQuerySchema>;

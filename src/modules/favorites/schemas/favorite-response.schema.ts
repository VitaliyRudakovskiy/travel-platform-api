import z from "zod";

export const favoritesResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  offerId: z.uuid(),
  createdAt: z.date(),
  offer: z
    .object({
      id: z.uuid(),
      type: z.enum(["hotel", "flight", "tour"]),
      title: z.string(),
      price: z.number(),
      currency: z.enum(["BYN", "USD", "EUR"]),
      destination: z.object({
        id: z.uuid(),
        name: z.string(),
        countryCode: z.string().length(2),
      }),
      stars: z.number().nullable().optional(),
      address: z.string().nullable().optional(),
      flightNumber: z.string().nullable().optional(),
      airline: z.string().nullable().optional(),
      durationDays: z.number().nullable().optional(),
      includesMeals: z.boolean().nullable().optional(),
    })
    .optional(),
});

export type FavoritesResponseDto = z.infer<typeof favoritesResponseSchema>;

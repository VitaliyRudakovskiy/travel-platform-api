import { BookingStatus, Currency, OfferType } from "@prisma/client";
import z from "zod";

export const bookingResponseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  offerId: z.uuid(),
  startDate: z.date(),
  endDate: z.date(),
  guestsCount: z.number().int(),
  totalPrice: z.number(),
  status: z.enum([BookingStatus.draft, BookingStatus.cancelled, BookingStatus.confirmed]),
  createdAt: z.date(),
  updatedAt: z.date(),
  offer: z
    .object({
      id: z.uuid(),
      title: z.string(),
      type: z.enum([OfferType.hotel, OfferType.flight, OfferType.tour]),
      price: z.number(),
      currency: z.enum([Currency.BYN, Currency.USD, Currency.EUR]),
      destination: z.object({
        id: z.uuid(),
        name: z.string(),
        countryCode: z.string().length(2),
      }),
    })
    .optional(),
});

export type BookingResponseDto = z.infer<typeof bookingResponseSchema>;

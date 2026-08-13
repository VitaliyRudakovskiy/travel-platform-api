import { Currency, OfferStatus, OfferType } from "@prisma/client";
import z from "zod";

export const offerResponseSchema = z.object({
  id: z.uuid(),
  type: z.enum([OfferType.hotel, OfferType.flight, OfferType.tour]),
  destinationId: z.uuid(),
  ownerId: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  currency: z.enum([Currency.BYN, Currency.USD, Currency.EUR]),
  maxGuests: z.number().int(),
  maxConcurrentBookings: z.number().int(),
  availableFrom: z.date(),
  availableTo: z.date(),
  status: z.enum([OfferStatus.active, OfferStatus.archived]),
  stars: z.number().int().nullable(),
  address: z.string().nullable(),
  flightNumber: z.string().nullable(),
  airline: z.string().nullable(),
  durationDays: z.number().int().nullable(),
  includesMeals: z.boolean().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type OfferResponseDto = z.infer<typeof offerResponseSchema>;

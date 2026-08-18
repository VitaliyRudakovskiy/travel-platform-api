import { ApiProperty } from "@nestjs/swagger";
import { Currency, OfferType } from "@prisma/client";

export class FavoritesResponse {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Favorite record unique identifier",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "User ID who favorited the offer",
    format: "uuid",
  })
  userId: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Offer ID that was favorited",
    format: "uuid",
  })
  offerId: string;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "When the offer was added to favorites",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Offer details",
    type: "object",
    properties: {
      id: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
      type: {
        type: "string",
        enum: [OfferType.hotel, OfferType.flight, OfferType.tour],
        example: OfferType.flight,
      },
      title: { type: "string", example: "Luxury Beach Resort" },
      price: { type: "number", example: 150.5 },
      currency: {
        type: "string",
        enum: [Currency.BYN, Currency.USD, Currency.EUR],
        example: Currency.USD,
      },
      destination: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "123e4567-e89b-12d3-a456-426614174000",
          },
          name: { type: "string", example: "Paris" },
          countryCode: { type: "string", example: "FR" },
        },
      },
      stars: { type: "number", example: 4, nullable: true },
      address: {
        type: "string",
        example: "123 Main St, Paris",
        nullable: true,
      },
      flightNumber: { type: "string", example: "AF123", nullable: true },
      airline: { type: "string", example: "Air France", nullable: true },
      durationDays: { type: "number", example: 7, nullable: true },
      includesMeals: { type: "boolean", example: true, nullable: true },
    },
  })
  offer?: {
    id: string;
    type: OfferType;
    title: string;
    price: number;
    currency: Currency;
    destination: {
      id: string;
      name: string;
      countryCode: string;
    };
    stars?: number | null;
    address?: string | null;
    flightNumber?: string | null;
    airline?: string | null;
    durationDays?: number | null;
    includesMeals?: boolean | null;
  };
}

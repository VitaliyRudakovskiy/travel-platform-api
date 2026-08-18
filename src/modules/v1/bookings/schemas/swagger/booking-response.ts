import { ApiProperty } from "@nestjs/swagger";
import { BookingStatus, Currency, OfferType } from "@prisma/client";

export class BookingResponse {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Booking unique identifier",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "User ID who made the booking",
    format: "uuid",
  })
  userId: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Offer ID being booked",
    format: "uuid",
  })
  offerId: string;

  @ApiProperty({
    example: "2024-06-15T00:00:00.000Z",
    description: "Booking start date",
    format: "date-time",
  })
  startDate: Date;

  @ApiProperty({
    example: "2024-06-20T00:00:00.000Z",
    description: "Booking end date",
    format: "date-time",
  })
  endDate: Date;

  @ApiProperty({
    example: 2,
    description: "Number of guests",
    minimum: 1,
  })
  guestsCount: number;

  @ApiProperty({
    example: 1500.0,
    description: "Total price for the booking",
    minimum: 0,
  })
  totalPrice: number;

  @ApiProperty({
    example: "draft",
    description: "Booking status",
    enum: ["draft", "confirmed", "cancelled"],
  })
  status: BookingStatus;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Creation timestamp",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2024-01-15T00:00:00.000Z",
    description: "Last update timestamp",
    format: "date-time",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Offer details",
    type: "object",
    properties: {
      id: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
      title: { type: "string", example: "Luxury Beach Resort" },
      type: {
        type: "string",
        enum: ["hotel", "flight", "tour"],
        example: "hotel",
      },
      price: { type: "number", example: 150.5 },
      currency: { type: "string", enum: ["BYN", "USD", "EUR"], example: "USD" },
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
    },
  })
  offer?: {
    id: string;
    title: string;
    type: OfferType;
    price: number;
    currency: Currency;
    destination: {
      id: string;
      name: string;
      countryCode: string;
    };
  };
}

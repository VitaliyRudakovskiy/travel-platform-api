import { ApiProperty } from "@nestjs/swagger";
import { Currency, OfferStatus, OfferType } from "@prisma/client";

export class OfferResponse {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Offer unique identifier",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    example: "hotel",
    description: "Type of offer",
    enum: ["hotel", "flight", "tour"],
  })
  type: OfferType;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Destination ID",
    format: "uuid",
  })
  destinationId: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Owner (user) ID",
    format: "uuid",
  })
  ownerId: string;

  @ApiProperty({
    example: "Luxury Beach Resort",
    description: "Offer title",
  })
  title: string;

  @ApiProperty({
    example: "Beautiful beachfront resort with pool",
    description: "Offer description",
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 150.5,
    description: "Price per night/person",
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    example: "USD",
    description: "Currency code",
    enum: ["BYN", "USD", "EUR"],
  })
  currency: Currency;

  @ApiProperty({
    example: 4,
    description: "Maximum number of guests",
    minimum: 1,
  })
  maxGuests: number;

  @ApiProperty({
    example: 10,
    description: "Maximum concurrent bookings",
    minimum: 1,
  })
  maxConcurrentBookings: number;

  @ApiProperty({
    example: "2024-06-01T00:00:00.000Z",
    description: "Availability start date",
    format: "date-time",
  })
  availableFrom: Date;

  @ApiProperty({
    example: "2024-08-31T23:59:59.000Z",
    description: "Availability end date",
    format: "date-time",
  })
  availableTo: Date;

  @ApiProperty({
    example: "active",
    description: "Offer status",
    enum: ["active", "archived"],
  })
  status: OfferStatus;

  @ApiProperty({
    example: 4,
    description: "Hotel stars rating (hotel only)",
    minimum: 1,
    maximum: 5,
    nullable: true,
  })
  stars: number | null;

  @ApiProperty({
    example: "123 Main St, Paris",
    description: "Hotel address (hotel only)",
    nullable: true,
  })
  address: string | null;

  @ApiProperty({
    example: "AF123",
    description: "Flight number (flight only)",
    nullable: true,
  })
  flightNumber: string | null;

  @ApiProperty({
    example: "Air France",
    description: "Airline name (flight only)",
    nullable: true,
  })
  airline: string | null;

  @ApiProperty({
    example: 7,
    description: "Tour duration in days (tour only)",
    nullable: true,
  })
  durationDays: number | null;

  @ApiProperty({
    example: true,
    description: "Whether meals are included (tour only)",
    nullable: true,
  })
  includesMeals: boolean | null;

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
    example: null,
    description: "Deletion timestamp (null if not deleted)",
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    description: "Destination information",
    type: "object",
    properties: {
      id: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
      name: { type: "string", example: "Paris" },
      countryCode: { type: "string", example: "FR" },
    },
  })
  destination?: {
    id: string;
    name: string;
    countryCode: string;
  };

  @ApiProperty({
    description: "Owner (user) information",
    type: "object",
    properties: {
      id: { type: "string", example: "123e4567-e89b-12d3-a456-426614174000" },
      username: { type: "string", example: "john_doe" },
      email: { type: "string", example: "john@example.com" },
    },
  })
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

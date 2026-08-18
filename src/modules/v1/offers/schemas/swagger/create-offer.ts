import { ApiProperty } from "@nestjs/swagger";
import { Currency, OfferStatus, OfferType } from "@prisma/client";
import {
  ADDRESS_MAX_LENGTH,
  AIRLINE_MAX_LENGTH,
  DURATION_DAYS_MAX_VALUE,
  DURATION_DAYS_MIN_VALUE,
  FLIGHT_NUMBER_MAX_LENGTH,
  MAX_CONCURRENT_BOOKINGS_MAX_VALUE,
  MAX_CONCURRENT_BOOKINGS_MIN_VALUE,
  MAX_GUESTS_MAX_VALUE,
  MAX_GUESTS_MIN_VALUE,
  PRICE_MAX_VALUE,
  PRICE_MIN_VALUE,
  STARS_MAX_VALUE,
  STARS_MIN_VALUE,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from "../../models/schema.constants";

export class CreateOffer {
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
    example: "Luxury Beach Resort",
    description: "Offer title",
    minLength: TITLE_MIN_LENGTH,
    maxLength: TITLE_MAX_LENGTH,
  })
  title: string;

  @ApiProperty({
    example: "Beautiful beachfront resort with pool and spa",
    description: "Offer description",
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    example: 150.5,
    description: "Price per night/person",
    minimum: PRICE_MIN_VALUE,
    maximum: PRICE_MAX_VALUE,
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
    minimum: MAX_GUESTS_MIN_VALUE,
    maximum: MAX_GUESTS_MAX_VALUE,
  })
  maxGuests: number;

  @ApiProperty({
    example: 10,
    description: "Maximum concurrent bookings",
    minimum: MAX_CONCURRENT_BOOKINGS_MIN_VALUE,
    maximum: MAX_CONCURRENT_BOOKINGS_MAX_VALUE,
  })
  maxConcurrentBookings: number;

  @ApiProperty({
    example: "2024-06-01T00:00:00.000Z",
    description: "Availability start date (ISO 8601)",
    format: "date-time",
  })
  availableFrom: string;

  @ApiProperty({
    example: "2024-08-31T23:59:59.000Z",
    description: "Availability end date (ISO 8601)",
    format: "date-time",
  })
  availableTo: string;

  @ApiProperty({
    example: "active",
    description: "Offer status",
    enum: ["active", "archived"],
    default: "active",
    required: false,
  })
  status?: OfferStatus;

  @ApiProperty({
    example: 4,
    description: "Hotel stars rating (required for hotel type)",
    minimum: STARS_MIN_VALUE,
    maximum: STARS_MAX_VALUE,
    required: false,
  })
  stars?: number;

  @ApiProperty({
    example: "123 Main St, Paris",
    description: "Hotel address (required for hotel type)",
    maxLength: ADDRESS_MAX_LENGTH,
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: "AF123",
    description: "Flight number (required for flight type)",
    maxLength: FLIGHT_NUMBER_MAX_LENGTH,
    required: false,
  })
  flightNumber?: string;

  @ApiProperty({
    example: "Air France",
    description: "Airline name (required for flight type)",
    maxLength: AIRLINE_MAX_LENGTH,
    required: false,
  })
  airline?: string;

  // Tour specific fields
  @ApiProperty({
    example: 7,
    description: "Tour duration in days (required for tour type)",
    minimum: DURATION_DAYS_MIN_VALUE,
    maximum: DURATION_DAYS_MAX_VALUE,
    required: false,
  })
  durationDays?: number;

  @ApiProperty({
    example: true,
    description: "Whether meals are included (tour type)",
    default: false,
    required: false,
  })
  includesMeals?: boolean;
}

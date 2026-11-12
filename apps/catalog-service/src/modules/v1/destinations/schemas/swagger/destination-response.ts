import { ApiProperty } from "@nestjs/swagger";

export class DestinationResponse {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Destination unique identifier",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    example: "Eiffel Tower",
    description: "Destination name",
  })
  name: string;

  @ApiProperty({
    example: "Iconic iron lattice tower in Paris",
    description: "Destination description",
  })
  description: string;

  @ApiProperty({
    example: "Paris",
    description: "City where the destination is located",
  })
  city: string;

  @ApiProperty({
    example: "FR",
    description: "Country code (ISO 3166-1 alpha-2)",
    minLength: 2,
    maxLength: 2,
    pattern: "^[A-Z]{2}$",
  })
  countryCode: string;

  @ApiProperty({
    example: 48.8584,
    description: "Latitude coordinate",
    minimum: -90,
    maximum: 90,
  })
  latitude: number;

  @ApiProperty({
    example: 2.2945,
    description: "Longitude coordinate",
    minimum: -180,
    maximum: 180,
  })
  longitude: number;

  @ApiProperty({
    example: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
    description: "Array of image URLs",
    type: [String],
  })
  images: string[];

  @ApiProperty({
    example: 4.8,
    description: "Average rating",
    minimum: 0,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    example: 1250,
    description: "Number of reviews",
    minimum: 0,
  })
  reviewCount: number;

  @ApiProperty({
    example: 75.5,
    description: "Average price in USD",
    minimum: 0,
  })
  averagePrice: number;

  @ApiProperty({
    example: true,
    description: "Whether the destination is currently active",
  })
  isActive: boolean;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Creation timestamp",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Last update timestamp",
    format: "date-time",
  })
  updatedAt: Date;
}

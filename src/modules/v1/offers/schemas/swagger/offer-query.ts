import { ApiProperty } from "@nestjs/swagger";
import { LIMIT_MAX_VALUE, LIMIT_MIN_VALUE, PAGE_MIN_VALUE } from "../../models/schema.constants";
import { OfferType } from "@prisma/client";

export class OfferQuery {
  @ApiProperty({
    example: "1",
    description: "Page number for pagination",
    minimum: PAGE_MIN_VALUE,
    default: 1,
    required: false,
  })
  page?: string;

  @ApiProperty({
    example: "10",
    description: "Number of items per page",
    minimum: LIMIT_MIN_VALUE,
    maximum: LIMIT_MAX_VALUE,
    default: 10,
    required: false,
  })
  limit?: string;

  @ApiProperty({
    example: "hotel",
    description: "Filter by offer type",
    enum: ["hotel", "flight", "tour"],
    required: false,
  })
  type?: OfferType;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Filter by destination ID",
    format: "uuid",
    required: false,
  })
  destinationId?: string;

  @ApiProperty({
    example: "50",
    description: "Minimum price filter",
    minimum: 0,
    required: false,
  })
  minPrice?: string;

  @ApiProperty({
    example: "200",
    description: "Maximum price filter",
    minimum: 0,
    required: false,
  })
  maxPrice?: string;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Filter by availability from date (ISO 8601)",
    format: "date-time",
    required: false,
  })
  availableFrom?: string;

  @ApiProperty({
    example: "2024-12-31T23:59:59.000Z",
    description: "Filter by availability to date (ISO 8601)",
    format: "date-time",
    required: false,
  })
  availableTo?: string;

  @ApiProperty({
    example: "active",
    description: "Filter by offer status",
    enum: ["active", "archived"],
    default: "active",
    required: false,
  })
  status?: "active" | "archived";

  @ApiProperty({
    example: "price",
    description: "Sort by field",
    enum: ["price", "createdAt"],
    default: "createdAt",
    required: false,
  })
  sortBy?: "price" | "createdAt";

  @ApiProperty({
    example: "desc",
    description: "Sort order",
    enum: ["asc", "desc"],
    default: "desc",
    required: false,
  })
  sortOrder?: "asc" | "desc";
}

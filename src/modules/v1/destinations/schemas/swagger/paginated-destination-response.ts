import { ApiProperty } from "@nestjs/swagger";
import { DestinationResponseDto } from "../destination-response.schema";
import { DestinationResponse } from "./destination-response";

export class PaginatedDestinationResponse {
  @ApiProperty({
    description: "Array of destinations",
    type: [DestinationResponse],
  })
  items: DestinationResponseDto[];

  @ApiProperty({
    example: 100,
    description: "Total number of destinations matching the query",
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: "Current page number",
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: "Number of items per page",
    minimum: 1,
  })
  limit: number;

  @ApiProperty({
    example: 10,
    description: "Total number of pages",
    minimum: 0,
  })
  totalPages: number;

  @ApiProperty({
    example: true,
    description: "Whether there is a next page",
  })
  hasNextPage: boolean;

  @ApiProperty({
    example: false,
    description: "Whether there is a previous page",
  })
  hasPreviousPage: boolean;
}

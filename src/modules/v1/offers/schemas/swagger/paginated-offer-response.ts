import { ApiProperty } from "@nestjs/swagger";
import { OfferResponseDto } from "../offer-response.schema";
import { OfferResponse } from "./offer-response";

export class PaginatedOfferResponse {
  @ApiProperty({
    description: "List of offers",
    type: [OfferResponse],
  })
  data: OfferResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: "object",
    properties: {
      total: {
        type: "number",
        example: 100,
        description: "Total number of offers",
      },
      page: { type: "number", example: 1, description: "Current page" },
      limit: { type: "number", example: 10, description: "Items per page" },
      totalPages: { type: "number", example: 10, description: "Total pages" },
      hasNextPage: {
        type: "boolean",
        example: true,
        description: "Has next page",
      },
      hasPreviousPage: {
        type: "boolean",
        example: false,
        description: "Has previous page",
      },
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

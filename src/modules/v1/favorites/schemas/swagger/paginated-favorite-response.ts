import { ApiProperty } from "@nestjs/swagger";
import { FavoritesResponse } from "./favorite-response";
import { FavoritesResponseDto } from "../favorite-response.schema";

export class PaginatedFavoritesResponse {
  @ApiProperty({
    description: "List of favorites",
    type: [FavoritesResponse],
  })
  data: FavoritesResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: "object",
    properties: {
      total: {
        type: "number",
        example: 100,
        description: "Total number of favorites",
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

import { ApiProperty } from "@nestjs/swagger";
import { NotificationResponse } from "./notification-response";
import { type NotificationResponseDto } from "../notification-response.schema";

export class PaginatedNotificationResponse {
  @ApiProperty({
    description: "List of in-app notifications",
    type: [NotificationResponse],
  })
  data: NotificationResponseDto[];

  @ApiProperty({
    description: "Pagination metadata",
    type: "object",
    properties: {
      total: {
        type: "number",
        example: 100,
        description: "Total number of notifications",
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

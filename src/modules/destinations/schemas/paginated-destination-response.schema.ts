import z from "zod";
import { destinationResponseSchema } from "./destination-response.schema";

export const paginatedDestinationResponseSchema = z.object({
  data: z.array(destinationResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type PaginatedDestinationResponseDto = z.infer<typeof paginatedDestinationResponseSchema>;

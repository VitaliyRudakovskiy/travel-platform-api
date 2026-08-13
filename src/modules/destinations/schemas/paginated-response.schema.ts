import z from "zod";
import { destinationResponseSchema } from "./destination-response.schema";

export const paginatedResponseSchema = z.object({
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

export type PaginatedResponseDto = z.infer<typeof paginatedResponseSchema>;

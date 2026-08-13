import { z } from "zod";
import { offerResponseSchema } from "./offer-response.schema";

export const paginatedOfferResponseSchema = z.object({
  data: z.array(offerResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type PaginatedOfferResponseDto = z.infer<typeof paginatedOfferResponseSchema>;

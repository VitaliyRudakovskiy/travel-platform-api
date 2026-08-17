import z from "zod";
import { favoritesResponseSchema } from "./favorite-response.schema";

export const paginatedFavoriteResponseSchema = z.object({
  data: z.array(favoritesResponseSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type PaginatedFavoritesResponseDto = z.infer<typeof paginatedFavoriteResponseSchema>;

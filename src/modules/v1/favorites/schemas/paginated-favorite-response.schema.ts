import z from "zod";
import { favoritesResponseSchema } from "./favorite-response.schema";
import { paginatedSchema } from "@shared/schemas/paginated-response.schema";

export const paginatedFavoriteResponseSchema = paginatedSchema(favoritesResponseSchema);

export type PaginatedFavoritesResponseDto = z.infer<typeof paginatedFavoriteResponseSchema>;

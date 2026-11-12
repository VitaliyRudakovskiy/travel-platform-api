import z from "zod";
import { favoritesResponseSchema } from "./favorite-response.schema";
import { paginatedSchema } from "@app/common";

export const paginatedFavoriteResponseSchema = paginatedSchema(favoritesResponseSchema);

export type PaginatedFavoritesResponseDto = z.infer<typeof paginatedFavoriteResponseSchema>;

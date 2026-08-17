import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { FavoritesService } from "./favorites.service";
import { FavoritesResponseDto } from "./schemas/favorite-response.schema";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/users/schemas/user-response.schema";
import { PaginatedFavoritesResponseDto } from "./schemas/paginated-favorite-response.schema";
import { ZodValidationPipe } from "@pipes/zod-validation.pipe";
import { type FavoriteQueryDto, favoriteQuerySchema } from "./schemas/favorite-query.schema";

@UseGuards(AuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll(
    @Query(new ZodValidationPipe(favoriteQuerySchema)) query: FavoriteQueryDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<PaginatedFavoritesResponseDto> {
    return this.favoritesService.getAll(currentUser.id, query);
  }

  @Post()
  async addToFavorites(
    @Body("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<FavoritesResponseDto> {
    return this.favoritesService.addToFavorites(offerId, currentUser.id);
  }

  @Delete()
  async deleteFromFavorites(
    @Body("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<void> {
    return this.favoritesService.removeFromFavorites(offerId, currentUser.id);
  }
}

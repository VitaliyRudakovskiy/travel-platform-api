import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
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
  async getFavorites(
    @Query(new ZodValidationPipe(favoriteQuerySchema)) query: FavoriteQueryDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<PaginatedFavoritesResponseDto> {
    return this.favoritesService.getAll(currentUser.id, query);
  }

  @Get("check/:offerId")
  async isFavorite(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.favoritesService.isFavorite(offerId, currentUser.id);
    return { isFavorite };
  }

  @Post()
  async addToFavorites(
    @Body("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<FavoritesResponseDto> {
    return this.favoritesService.addToFavorites(offerId, currentUser.id);
  }

  @Delete(":offerId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFromFavorites(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<void> {
    return this.favoritesService.removeFromFavorites(offerId, currentUser.id);
  }
}

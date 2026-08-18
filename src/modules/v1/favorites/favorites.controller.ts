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
  Version,
} from "@nestjs/common";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { FavoritesService } from "./favorites.service";
import { FavoritesResponseDto } from "./schemas/favorite-response.schema";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { PaginatedFavoritesResponseDto } from "./schemas/paginated-favorite-response.schema";
import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import { type FavoriteQueryDto, favoriteQuerySchema } from "./schemas/favorite-query.schema";

@UseGuards(AuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Version("1")
  async getFavorites(
    @Query(new ZodValidationPipe(favoriteQuerySchema)) query: FavoriteQueryDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<PaginatedFavoritesResponseDto> {
    return this.favoritesService.getAll(currentUser.id, query);
  }

  @Get("check/:offerId")
  @Version("1")
  async isFavorite(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.favoritesService.isFavorite(offerId, currentUser.id);
    return { isFavorite };
  }

  @Post()
  @Version("1")
  async addToFavorites(
    @Body("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<FavoritesResponseDto> {
    return this.favoritesService.addToFavorites(offerId, currentUser.id);
  }

  @Delete(":offerId")
  @Version("1")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFromFavorites(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<void> {
    return this.favoritesService.removeFromFavorites(offerId, currentUser.id);
  }
}

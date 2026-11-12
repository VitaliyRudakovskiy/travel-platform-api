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
import { AuthGuard } from "@shared/guards/auth.guard";
import { FavoritesService } from "./favorites.service";
import { FavoritesResponseDto } from "./schemas/favorite-response.schema";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { PaginatedFavoritesResponseDto } from "./schemas/paginated-favorite-response.schema";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { type FavoriteQueryDto, favoriteQuerySchema } from "./schemas/favorite-query.schema";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginatedFavoritesResponse } from "./schemas/swagger/paginated-favorite-response";
import { FavoritesResponse } from "./schemas/swagger/favorite-response";

@ApiTags("Favorites")
@UseGuards(AuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @Version("1")
  @ApiOperation({
    summary: "Get user's favorites",
    description: "Returns a paginated list of offers that the current user has favorited",
  })
  @ApiResponse({
    status: 200,
    description: "List of favorites retrieved successfully",
    type: PaginatedFavoritesResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid query parameters",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async getFavorites(
    @Query(new ZodValidationPipe(favoriteQuerySchema)) query: FavoriteQueryDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<PaginatedFavoritesResponseDto> {
    return this.favoritesService.getAll(currentUser.id, query);
  }

  @Get("check/:offerId")
  @Version("1")
  @ApiOperation({
    summary: "Check if offer is in favorites",
    description:
      "Returns a boolean indicating whether the specified offer is in the user's favorites",
  })
  @ApiParam({
    name: "offerId",
    description: "Offer UUID to check",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Check result",
    schema: {
      type: "object",
      properties: {
        isFavorite: {
          type: "boolean",
          example: true,
          description: "True if offer is in favorites",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  async isFavorite(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<{ isFavorite: boolean }> {
    const isFavorite = await this.favoritesService.isFavorite(offerId, currentUser.id);
    return { isFavorite };
  }

  @Post()
  @Version("1")
  @ApiOperation({
    summary: "Add offer to favorites",
    description: "Adds an offer to the current user's favorites list",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        offerId: {
          type: "string",
          format: "uuid",
          example: "123e4567-e89b-12d3-a456-426614174000",
          description: "Offer UUID to add to favorites",
        },
      },
      required: ["offerId"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Offer added to favorites successfully",
    type: FavoritesResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid offerId format",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or user not found",
  })
  @ApiResponse({
    status: 409,
    description: "Offer is already in favorites",
  })
  async addToFavorites(
    @Body("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<FavoritesResponseDto> {
    return this.favoritesService.addToFavorites(offerId, currentUser.id);
  }

  @Delete(":offerId")
  @Version("1")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Remove offer from favorites",
    description: "Removes an offer from the current user's favorites list",
  })
  @ApiParam({
    name: "offerId",
    description: "Offer UUID to remove from favorites",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 204,
    description: "Offer removed from favorites successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found in favorites",
  })
  async deleteFromFavorites(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<void> {
    return this.favoritesService.removeFromFavorites(offerId, currentUser.id);
  }
}

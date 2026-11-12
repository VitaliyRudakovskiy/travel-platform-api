import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Version,
} from "@nestjs/common";
import { OffersService } from "./offers.service";
import { OfferResponseDto } from "./schemas/offer-response.schema";
import { createOfferSchema, type CreateOfferDto } from "./schemas/create-offer.schema";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { AuthGuard } from "@shared/guards/auth.guard";
import { type OfferQueryDto, offerQuerySchema } from "./schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "./schemas/paginated-offer-response.schema";
import { type UpdateOfferDto, updateOfferSchema } from "./schemas/update-offer.schema";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginatedOfferResponse } from "./schemas/swagger/paginated-offer-response";
import { OfferResponse } from "./schemas/swagger/offer-response";
import { UpdateOffer } from "./schemas/swagger/update-offer";
import { CreateOffer } from "./schemas/swagger/create-offer";

@ApiTags("Offers")
@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @Version("1")
  @ApiOperation({
    summary: "Get all offers",
    description: `
      Returns a paginated list of offers with optional filtering and sorting.

      Features:
      - Pagination (page, limit)
      - Filter by type (hotel, flight, tour)
      - Filter by destination ID
      - Filter by price range (minPrice, maxPrice)
      - Filter by availability date range
      - Filter by status (active, archived)
      - Sort by price or creation date
    `,
  })
  @ApiResponse({
    status: 200,
    description: "List of offers retrieved successfully",
    type: PaginatedOfferResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid query parameters",
  })
  async getAll(
    @Query(new ZodValidationPipe(offerQuerySchema)) query: OfferQueryDto,
  ): Promise<PaginatedOfferResponseDto> {
    return this.offersService.getAll(query);
  }

  @Get(":offerId")
  @Version("1")
  @ApiOperation({
    summary: "Get an offer by ID",
    description: "Returns detailed information about a specific offer",
  })
  @ApiParam({
    name: "offerId",
    description: "Offer UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Offer found",
    type: OfferResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or already deleted",
  })
  async getOne(@Param("offerId") offerId: string): Promise<OfferResponseDto> {
    return this.offersService.getById(offerId);
  }

  @Post()
  @Version("1")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create a new offer",
    description: `
      Creates a new offer. Different fields are required based on offer type:

      - **Hotel**: Requires stars, address
      - **Flight**: Requires flightNumber, airline
      - **Tour**: Requires durationDays, optional includesMeals
    `,
  })
  @ApiBody({ type: CreateOffer })
  @ApiResponse({
    status: 201,
    description: "Offer created successfully",
    type: OfferResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data or end date before start date",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 404,
    description: "Destination not found",
  })
  async create(
    @Body(new ZodValidationPipe(createOfferSchema))
    createOfferDto: CreateOfferDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<OfferResponseDto> {
    return this.offersService.create(createOfferDto, currentUser.id);
  }

  @Patch(":offerId")
  @Version("1")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update an offer",
    description: "Updates an existing offer. Only the owner can update their offer.",
  })
  @ApiBody({ type: UpdateOffer })
  @ApiParam({
    name: "offerId",
    description: "Offer UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Offer updated successfully",
    type: OfferResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data, end date before start date, or trying to change offer type",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - You can only update your own offers",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or destination not found",
  })
  async update(
    @Param("offerId") offerId: string,
    @Body(new ZodValidationPipe(updateOfferSchema))
    updateOfferDto: UpdateOfferDto,
    @CurrentUser() currentUser: UserResponseDto,
  ) {
    return this.offersService.update(offerId, updateOfferDto, currentUser.id);
  }

  @Delete(":offerId")
  @Version("1")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Soft delete an offer",
    description:
      "Soft deletes an offer (sets deletedAt and status to archived). Only the owner can delete their offer.",
  })
  @ApiParam({
    name: "offerId",
    description: "Offer UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 204,
    description: "Offer soft deleted successfully",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - You can only delete your own offers",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or already deleted",
  })
  async delete(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<void> {
    return this.offersService.delete(offerId, currentUser.id);
  }

  @Delete("force/:offerId")
  @Version("1")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Hard delete an offer (Admin only)",
    description:
      "Permanently deletes an offer from the database. Only the owner can delete their offer.",
  })
  @ApiParam({
    name: "offerId",
    description: "Offer UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 204,
    description: "Offer permanently deleted",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - You can only delete your own offers",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found",
  })
  async hardDelete(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<void> {
    return this.offersService.hardDelete(offerId, currentUser.id);
  }
}

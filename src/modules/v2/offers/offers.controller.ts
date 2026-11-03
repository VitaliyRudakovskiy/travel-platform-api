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
} from "@nestjs/common";
import { OffersService } from "@modules/v1/offers/offers.service";
import { OfferResponseDto } from "@modules/v1/offers/schemas/offer-response.schema";
import {
  createOfferSchema,
  type CreateOfferDto,
} from "@modules/v1/offers/schemas/create-offer.schema";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import {
  type OfferQueryDto,
  offerQuerySchema,
} from "@modules/v1/offers/schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "@modules/v1/offers/schemas/paginated-offer-response.schema";
import {
  type UpdateOfferDto,
  updateOfferSchema,
} from "@modules/v1/offers/schemas/update-offer.schema";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PaginatedOfferResponse } from "@modules/v1/offers/schemas/swagger/paginated-offer-response";
import { OfferResponse } from "@modules/v1/offers/schemas/swagger/offer-response";
import { UpdateOffer } from "@modules/v1/offers/schemas/swagger/update-offer";
import { CreateOffer } from "@modules/v1/offers/schemas/swagger/create-offer";

@ApiTags("Offers")
@Controller({ path: "offers", version: "2" })
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @ApiOperation({
    summary: "Get all offers",
    description: "Returns a paginated list of offers with optional filtering and sorting.",
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new offer",
    description: "Creates a new offer. Only the owner can later update or delete it.",
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
}

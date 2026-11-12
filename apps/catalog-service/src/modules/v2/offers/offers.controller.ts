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
import { OffersService } from "../../v1/offers/offers.service";
import { OfferResponseDto } from "../../v1/offers/schemas/offer-response.schema";
import {
  createOfferSchema,
  type CreateOfferDto,
} from "../../v1/offers/schemas/create-offer.schema";
import {
  ZodValidationPipe,
  CurrentUser,
  type AuthenticatedUser,
  UserRole,
  GatewayAuthGuard,
  RolesGuard,
  Roles,
} from "@app/common";
import { type OfferQueryDto, offerQuerySchema } from "../../v1/offers/schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "../../v1/offers/schemas/paginated-offer-response.schema";
import {
  type UpdateOfferDto,
  updateOfferSchema,
} from "../../v1/offers/schemas/update-offer.schema";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PaginatedOfferResponse } from "../../v1/offers/schemas/swagger/paginated-offer-response";
import { OfferResponse } from "../../v1/offers/schemas/swagger/offer-response";
import { UpdateOffer } from "../../v1/offers/schemas/swagger/update-offer";
import { CreateOffer } from "../../v1/offers/schemas/swagger/create-offer";

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
  @UseGuards(GatewayAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Agent)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Create a new offer",
    description:
      "Creates a new offer. Admin and Agent only. The owner or an Admin can later update or delete it.",
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
    status: 403,
    description: "Forbidden - Admin or Agent role required",
  })
  @ApiResponse({
    status: 404,
    description: "Destination not found",
  })
  async create(
    @Body(new ZodValidationPipe(createOfferSchema))
    createOfferDto: CreateOfferDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<OfferResponseDto> {
    return this.offersService.create(createOfferDto, currentUser.id);
  }

  @Patch(":offerId")
  @UseGuards(GatewayAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update an offer",
    description: "Updates an existing offer. Only the owner or an Admin can update it.",
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
    description: "Forbidden - You can only update your own offers unless you are an Admin",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or destination not found",
  })
  async update(
    @Param("offerId") offerId: string,
    @Body(new ZodValidationPipe(updateOfferSchema))
    updateOfferDto: UpdateOfferDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ) {
    return this.offersService.update(offerId, updateOfferDto, currentUser.id, currentUser.role);
  }

  @Delete(":offerId")
  @UseGuards(GatewayAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Soft delete an offer",
    description:
      "Soft deletes an offer (sets deletedAt and status to archived). Only the owner or an Admin can delete it.",
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
    description: "Forbidden - You can only delete your own offers unless you are an Admin",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or already deleted",
  })
  async delete(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<void> {
    return this.offersService.delete(offerId, currentUser.id, currentUser.role);
  }
}

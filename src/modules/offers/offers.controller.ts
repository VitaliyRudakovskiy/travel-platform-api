import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { OffersService } from "./offers.service";
import { OfferResponseDto } from "./schemas/offer-response.schema";
import { createOfferSchema, type CreateOfferDto } from "./schemas/create-offer-schema";
import { ZodValidationPipe } from "@pipes/zod-validation.pipe";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/users/schemas/user-response.schema";
import { AuthGuard } from "src/guards/auth.guard";
import { type OfferQueryDto, offerQuerySchema } from "./schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "./schemas/paginated-offer-response.schema";

@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getAll(
    @Query(new ZodValidationPipe(offerQuerySchema)) query: OfferQueryDto,
  ): Promise<PaginatedOfferResponseDto> {
    return this.offersService.getAll(query);
  }

  @Get(":offerId")
  async getOne(@Param("offerId") offerId: string): Promise<OfferResponseDto> {
    return this.offersService.getById(offerId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body(new ZodValidationPipe(createOfferSchema))
    createOfferDto: CreateOfferDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<OfferResponseDto> {
    return this.offersService.create(createOfferDto, currentUser.id);
  }
}

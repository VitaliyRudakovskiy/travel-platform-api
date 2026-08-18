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
import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { type OfferQueryDto, offerQuerySchema } from "./schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "./schemas/paginated-offer-response.schema";
import { type UpdateOfferDto, updateOfferSchema } from "./schemas/update-offer.schema";

@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @Version("1")
  async getAll(
    @Query(new ZodValidationPipe(offerQuerySchema)) query: OfferQueryDto,
  ): Promise<PaginatedOfferResponseDto> {
    return this.offersService.getAll(query);
  }

  @Get(":offerId")
  @Version("1")
  async getOne(@Param("offerId") offerId: string): Promise<OfferResponseDto> {
    return this.offersService.getById(offerId);
  }

  @Post()
  @Version("1")
  @UseGuards(AuthGuard)
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
  async hardDelete(
    @Param("offerId") offerId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<void> {
    return this.offersService.hardDelete(offerId, currentUser.id);
  }
}

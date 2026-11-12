import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { ZodValidationPipe } from "@app/common";
import {
  type AvailabilityQueryDto,
  type AvailabilityResponseDto,
  availabilityQuerySchema,
  type CapacityChangeDto,
  capacityChangeSchema,
  type CapacityResponseDto,
} from "@app/contracts";
import { InternalOffersService } from "./internal-offers.service";

// Service-to-service HTTP API (spec 3.3), reachable only inside the Docker network, not routed by the gateway.
// VERSION_NEUTRAL keeps the path as is (otherwise URI versioning would prefix it with /api/v1).
@ApiExcludeController()
@Controller({ path: "internal/v1/offers", version: VERSION_NEUTRAL })
export class InternalOffersController {
  constructor(private readonly internalOffersService: InternalOffersService) {}

  @Get(":offerId/availability")
  async checkAvailability(
    @Param("offerId", new ParseUUIDPipe()) offerId: string,
    @Query(new ZodValidationPipe(availabilityQuerySchema)) query: AvailabilityQueryDto,
  ): Promise<AvailabilityResponseDto> {
    return this.internalOffersService.checkAvailability(offerId, query);
  }

  @Patch(":offerId/capacity")
  async changeCapacity(
    @Param("offerId", new ParseUUIDPipe()) offerId: string,
    @Body(new ZodValidationPipe(capacityChangeSchema)) body: CapacityChangeDto,
  ): Promise<CapacityResponseDto> {
    return this.internalOffersService.changeCapacity(offerId, body.reservedDelta);
  }
}

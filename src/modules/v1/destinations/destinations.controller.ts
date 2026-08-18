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
  UsePipes,
  Version,
} from "@nestjs/common";
import { DestinationsService } from "./destinations.service";
import {
  createDestinationSchema,
  type CreateDestinationDto,
} from "./schemas/create-destination.schema";
import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import { DestinationResponseDto } from "./schemas/destination-response.schema";
import {
  udpateDestinationSchema,
  type UpdateDestinationDto,
} from "./schemas/update-destination.schema";
import {
  type DestinationQueryDto,
  destinationQuerySchema,
} from "./schemas/destination-query.schema";
import { PaginatedDestinationResponseDto } from "./schemas/paginated-destination-response.schema";

@Controller("destinations")
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  @Version("1")
  async get(
    @Query(new ZodValidationPipe(destinationQuerySchema))
    query: DestinationQueryDto,
  ): Promise<PaginatedDestinationResponseDto> {
    return this.destinationsService.getAll(query);
  }

  @Get(":destinationId")
  @Version("1")
  async getOne(@Param("destinationId") destinationId: string): Promise<DestinationResponseDto> {
    return this.destinationsService.getById(destinationId);
  }

  @Post()
  @Version("1")
  @UsePipes(new ZodValidationPipe(createDestinationSchema))
  async create(
    @Body() createDestinationDto: CreateDestinationDto,
  ): Promise<DestinationResponseDto> {
    return this.destinationsService.create(createDestinationDto);
  }

  @Patch(":destinationId")
  @Version("1")
  async update(
    @Param("destinationId") destinationId: string,
    @Body(new ZodValidationPipe(udpateDestinationSchema))
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<DestinationResponseDto> {
    return this.destinationsService.update(destinationId, updateDestinationDto);
  }

  @Delete(":destinationId")
  @Version("1")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("destinationId") destinationId: string): Promise<void> {
    return this.destinationsService.delete(destinationId);
  }
}

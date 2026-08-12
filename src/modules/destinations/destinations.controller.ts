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
  UsePipes,
} from "@nestjs/common";
import { DestinationsService } from "./destinations.service";
import {
  createDestinationSchema,
  type CreateDestinationDto,
} from "./schemas/create-destination.schema";
import { ZodValidationPipe } from "@pipes/zod-validation.pipe";
import { DestinationResponseDto } from "./schemas/destination-response.schema";
import {
  udpateDestinationSchema,
  type UpdateDestinationDto,
} from "./schemas/update-destination.schema";

@Controller("destinations")
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  async get(): Promise<DestinationResponseDto[]> {
    return this.destinationsService.getAll();
  }

  @Get(":destinationId")
  async getOne(@Param("destinationId") destinationId: string): Promise<DestinationResponseDto> {
    return this.destinationsService.getById(destinationId);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createDestinationSchema))
  async create(
    @Body() createDestinationDto: CreateDestinationDto,
  ): Promise<DestinationResponseDto> {
    return this.destinationsService.create(createDestinationDto);
  }

  @Patch(":destinationId")
  async update(
    @Param("destinationId") destinationId: string,
    @Body(new ZodValidationPipe(udpateDestinationSchema))
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<DestinationResponseDto> {
    return this.destinationsService.update(destinationId, updateDestinationDto);
  }

  @Delete(":destinationId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("destinationId") destinationId: string): Promise<void> {
    return this.destinationsService.delete(destinationId);
  }
}

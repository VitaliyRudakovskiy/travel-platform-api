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
  UsePipes,
} from "@nestjs/common";
import { DestinationsService } from "@modules/v1/destinations/destinations.service";
import {
  createDestinationSchema,
  type CreateDestinationDto,
} from "@modules/v1/destinations/schemas/create-destination.schema";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { DestinationResponseDto } from "@modules/v1/destinations/schemas/destination-response.schema";
import {
  udpateDestinationSchema,
  type UpdateDestinationDto,
} from "@modules/v1/destinations/schemas/update-destination.schema";
import {
  type DestinationQueryDto,
  destinationQuerySchema,
} from "@modules/v1/destinations/schemas/destination-query.schema";
import { PaginatedDestinationResponseDto } from "@modules/v1/destinations/schemas/paginated-destination-response.schema";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PaginatedDestinationResponse } from "@modules/v1/destinations/schemas/swagger/paginated-destination-response";
import { DestinationResponse } from "@modules/v1/destinations/schemas/swagger/destination-response";

@ApiTags("Destinations")
@Controller({ path: "destinations", version: "2" })
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  @ApiOperation({
    summary: "Get all destinations",
    description: "Returns a paginated list of destinations with optional filtering.",
  })
  @ApiResponse({
    status: 200,
    description: "List of destinations retrieved successfully",
    type: PaginatedDestinationResponse,
  })
  @ApiQuery({
    name: "page",
    type: String,
    required: false,
    description: "Page number (default: 1)",
    example: "1",
  })
  @ApiQuery({
    name: "limit",
    type: String,
    required: false,
    description: "Items per page (default: 10, min: 1, max: 100)",
    example: "10",
  })
  @ApiQuery({
    name: "name",
    type: String,
    required: false,
    description: "Filter by destination name (partial match)",
    example: "Eiffel",
  })
  @ApiQuery({
    name: "countryCode",
    type: String,
    required: false,
    description: "Filter by country code (ISO 3166-1 alpha-2, e.g., FR, US)",
    example: "FR",
  })
  async get(
    @Query(new ZodValidationPipe(destinationQuerySchema))
    query: DestinationQueryDto,
  ): Promise<PaginatedDestinationResponseDto> {
    return this.destinationsService.getAll(query);
  }

  @Get(":destinationId")
  @ApiOperation({
    summary: "Get a destination by ID",
    description: "Returns detailed information about a specific destination",
  })
  @ApiParam({
    name: "destinationId",
    description: "Destination UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Destination found",
    type: DestinationResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Destination not found",
  })
  async getOne(@Param("destinationId") destinationId: string): Promise<DestinationResponseDto> {
    return this.destinationsService.getById(destinationId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ZodValidationPipe(createDestinationSchema))
  @ApiOperation({
    summary: "Create a new destination",
    description: "Creates a new destination",
  })
  @ApiResponse({
    status: 201,
    description: "Destination created successfully",
    type: DestinationResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  @ApiResponse({
    status: 409,
    description: "Destination with this name already exists",
  })
  async create(
    @Body() createDestinationDto: CreateDestinationDto,
  ): Promise<DestinationResponseDto> {
    return this.destinationsService.create(createDestinationDto);
  }

  @Patch(":destinationId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update a destination",
    description: "Updates an existing destination",
  })
  @ApiParam({
    name: "destinationId",
    description: "Destination UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Destination updated successfully",
    type: DestinationResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data",
  })
  @ApiResponse({
    status: 404,
    description: "Destination not found",
  })
  async update(
    @Param("destinationId") destinationId: string,
    @Body(new ZodValidationPipe(udpateDestinationSchema))
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<DestinationResponseDto> {
    return this.destinationsService.update(destinationId, updateDestinationDto);
  }

  @Delete(":destinationId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete a destination",
    description: "Deletes a destination by ID",
  })
  @ApiParam({
    name: "destinationId",
    description: "Destination UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 204,
    description: "Destination deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Destination not found",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("destinationId") destinationId: string): Promise<void> {
    return this.destinationsService.delete(destinationId);
  }
}

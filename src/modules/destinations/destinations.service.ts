import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { CreateDestinationDto } from "./schemas/create-destination.schema";
import { DestinationResponseDto } from "./schemas/destination-response.schema";
import { UpdateDestinationDto } from "./schemas/update-destination.schema";

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<DestinationResponseDto[]> {
    const destinations = await this.prisma.destination.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return destinations.map((dest) => ({
      id: dest.id,
      name: dest.name,
      countryCode: dest.countryCode,
      description: dest.description,
      createdAt: dest.createdAt,
      updatedAt: dest.updatedAt,
    }));
  }

  async getById(id: string): Promise<DestinationResponseDto> {
    const destination = await this.prisma.destination.findFirst({
      where: { id },
    });

    if (!destination) {
      throw new NotFoundException("Destination not found");
    }

    return {
      id: destination.id,
      name: destination.name,
      countryCode: destination.countryCode,
      description: destination.description,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
    };
  }

  async create(createDestinationDto: CreateDestinationDto): Promise<DestinationResponseDto> {
    const existing = await this.prisma.destination.findFirst({
      where: {
        name: createDestinationDto.name,
        countryCode: createDestinationDto.countryCode,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Destination "${createDestinationDto.name}" in "${createDestinationDto.countryCode}" already exists`,
      );
    }

    const destination = await this.prisma.destination.create({
      data: {
        name: createDestinationDto.name,
        description: createDestinationDto.description,
        countryCode: createDestinationDto.countryCode,
      },
    });

    return {
      id: destination.id,
      name: destination.name,
      countryCode: destination.countryCode,
      description: destination.description ?? null,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
    };
  }

  async update(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<DestinationResponseDto> {
    const existing = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Destination with id ${id} not found`);
    }

    if (updateDestinationDto.name || updateDestinationDto.countryCode) {
      const duplicate = await this.prisma.destination.findFirst({
        where: {
          name: updateDestinationDto.name ?? existing.name,
          countryCode: updateDestinationDto.countryCode ?? existing.countryCode,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          `Destination "${updateDestinationDto.name}" in "${updateDestinationDto.countryCode}" already exists`,
        );
      }
    }

    const destination = await this.prisma.destination.update({
      where: { id },
      data: {
        name: updateDestinationDto.name,
        countryCode: updateDestinationDto.countryCode,
        description: updateDestinationDto.description,
      },
    });

    return {
      id: destination.id,
      name: destination.name,
      countryCode: destination.countryCode,
      description: destination.description,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.destination.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Destination with id "${id}" not found`);
    }

    await this.prisma.destination.delete({
      where: { id },
    });
  }
}

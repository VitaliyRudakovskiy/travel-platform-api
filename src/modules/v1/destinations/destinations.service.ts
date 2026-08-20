import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { CreateDestinationDto } from "./schemas/create-destination.schema";
import { DestinationResponseDto } from "./schemas/destination-response.schema";
import { UpdateDestinationDto } from "./schemas/update-destination.schema";
import { PaginatedDestinationResponseDto } from "./schemas/paginated-destination-response.schema";
import { DestinationQueryDto } from "./schemas/destination-query.schema";

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(query: DestinationQueryDto): Promise<PaginatedDestinationResponseDto> {
    const { page, limit, name, countryCode } = query;

    const search: any = {};

    if (name) {
      search.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (countryCode) {
      search.countryCode = countryCode;
    }

    const total = await this.prisma.destination.count({ where: search });

    const destinations = await this.prisma.destination.findMany({
      where: search,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: destinations,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async getById(id: string): Promise<DestinationResponseDto> {
    const destination = await this.prisma.destination.findFirst({
      where: { id },
    });

    if (!destination) {
      throw new NotFoundException("Destination not found");
    }

    return destination;
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

    return destination;
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

    return destination;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.prisma.destination.findUnique({
      where: { id },
      include: {
        _count: { select: { offers: true } },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Destination with id "${id}" not found`);
    }

    if (existing._count.offers > 0) {
      throw new ConflictException(
        `Cannot delete destination with ${existing._count.offers} existing offers. ` +
          `Delete or archive the offers first.`,
      );
    }

    await this.prisma.destination.delete({
      where: { id },
    });
  }
}

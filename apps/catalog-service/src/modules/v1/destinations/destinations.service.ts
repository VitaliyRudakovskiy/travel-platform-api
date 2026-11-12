import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type FindOptionsWhere, ILike, Not, Repository } from "typeorm";
import { omitUndefined } from "../../../common/omit-undefined";
import { OfferEntity } from "../offers/entities/offer.entity";
import { DestinationEntity } from "./entities/destination.entity";
import { CreateDestinationDto } from "./schemas/create-destination.schema";
import { DestinationResponseDto } from "./schemas/destination-response.schema";
import { UpdateDestinationDto } from "./schemas/update-destination.schema";
import { PaginatedDestinationResponseDto } from "./schemas/paginated-destination-response.schema";
import { DestinationQueryDto } from "./schemas/destination-query.schema";

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(DestinationEntity)
    private readonly destinations: Repository<DestinationEntity>,
    @InjectRepository(OfferEntity)
    private readonly offers: Repository<OfferEntity>,
  ) {}

  async getAll(query: DestinationQueryDto): Promise<PaginatedDestinationResponseDto> {
    const { page, limit, name, countryCode } = query;

    const where: FindOptionsWhere<DestinationEntity> = {};

    if (name) {
      // Prisma `contains` + `mode: "insensitive"` -> ILIKE %name%
      where.name = ILike(`%${name}%`);
    }

    if (countryCode) {
      where.countryCode = countryCode;
    }

    const [destinations, total] = await this.destinations.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: "ASC" },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: destinations.map((destination) => this.toResponse(destination)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getById(id: string): Promise<DestinationResponseDto> {
    const destination = await this.destinations.findOneBy({ id });

    if (!destination) {
      throw new NotFoundException("Destination not found");
    }

    return this.toResponse(destination);
  }

  async create(createDestinationDto: CreateDestinationDto): Promise<DestinationResponseDto> {
    const existing = await this.destinations.findOneBy({
      name: createDestinationDto.name,
      countryCode: createDestinationDto.countryCode,
    });

    if (existing) {
      throw new ConflictException(
        `Destination "${createDestinationDto.name}" in "${createDestinationDto.countryCode}" already exists`,
      );
    }

    const destination = await this.destinations.save(
      this.destinations.create({
        name: createDestinationDto.name,
        description: createDestinationDto.description ?? null,
        countryCode: createDestinationDto.countryCode,
      }),
    );

    return this.toResponse(destination);
  }

  async update(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<DestinationResponseDto> {
    const existing = await this.destinations.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException(`Destination with id ${id} not found`);
    }

    if (updateDestinationDto.name || updateDestinationDto.countryCode) {
      const duplicate = await this.destinations.findOneBy({
        name: updateDestinationDto.name ?? existing.name,
        countryCode: updateDestinationDto.countryCode ?? existing.countryCode,
        id: Not(id),
      });

      if (duplicate) {
        throw new ConflictException(
          `Destination "${updateDestinationDto.name}" in "${updateDestinationDto.countryCode}" already exists`,
        );
      }
    }

    const destination = await this.destinations.save(
      this.destinations.merge(
        existing,
        omitUndefined({
          name: updateDestinationDto.name,
          countryCode: updateDestinationDto.countryCode,
          description: updateDestinationDto.description,
        }),
      ),
    );

    return this.toResponse(destination);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.destinations.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException(`Destination with id "${id}" not found`);
    }

    // withDeleted: soft-deleted offers still reference the destination (the FK would reject the delete)
    const offersCount = await this.offers.count({
      where: { destinationId: id },
      withDeleted: true,
    });

    if (offersCount > 0) {
      throw new ConflictException(
        `Cannot delete destination with ${offersCount} existing offers. ` +
          `Delete or archive the offers first.`,
      );
    }

    await this.destinations.delete({ id });
  }

  private toResponse(destination: DestinationEntity): DestinationResponseDto {
    return {
      id: destination.id,
      name: destination.name,
      countryCode: destination.countryCode,
      description: destination.description,
      createdAt: destination.createdAt,
      updatedAt: destination.updatedAt,
    };
  }
}

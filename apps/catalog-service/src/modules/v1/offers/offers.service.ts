import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Between,
  type FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from "typeorm";
import { UserRole } from "@app/common";
import { DestinationEntity } from "../destinations/entities/destination.entity";
import { OfferEntity } from "./entities/offer.entity";
import { OfferStatus, OfferType } from "./models/offer.enums";
import { OfferResponseDto } from "./schemas/offer-response.schema";
import { CreateOfferDto } from "./schemas/create-offer.schema";
import { OfferQueryDto } from "./schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "./schemas/paginated-offer-response.schema";
import { UpdateOfferDto } from "./schemas/update-offer.schema";

// Stage I/II responses embedded `destination { id, name, countryCode }` (same database, kept) and
// `user { id, username, email }` (users moved to auth_db: dropped, the contract field is `ownerId`).
const DESTINATION_SUMMARY = { id: true, name: true, countryCode: true } as const;

type TypeSpecificFields = Pick<
  OfferEntity,
  "stars" | "address" | "flightNumber" | "airline" | "durationDays" | "includesMeals"
>;

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offers: Repository<OfferEntity>,
    @InjectRepository(DestinationEntity)
    private readonly destinations: Repository<DestinationEntity>,
  ) {}

  async getAll(query: OfferQueryDto): Promise<PaginatedOfferResponseDto> {
    const {
      page,
      limit,
      type,
      destinationId,
      minPrice,
      maxPrice,
      availableFrom,
      availableTo,
      status,
      sortBy,
      sortOrder,
    } = query;

    const where: FindOptionsWhere<OfferEntity> = {
      status: status || OfferStatus.active,
    };

    if (type) {
      where.type = type;
    }

    if (destinationId) {
      where.destinationId = destinationId;
    }

    // as in stage I: 0 is treated as "no bound"
    if (minPrice && maxPrice) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice) {
      where.price = MoreThanOrEqual(minPrice);
    } else if (maxPrice) {
      where.price = LessThanOrEqual(maxPrice);
    }

    // Offers whose availability window overlaps [availableFrom, availableTo]
    if (availableTo) {
      where.availableFrom = LessThanOrEqual(new Date(availableTo));
    }

    if (availableFrom) {
      where.availableTo = MoreThanOrEqual(new Date(availableFrom));
    }

    // Soft-deleted offers are excluded automatically (@DeleteDateColumn)
    const [offers, total] = await this.offers.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder },
      relations: { destination: true },
      select: this.selectWithDestinationSummary(),
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: offers.map((offer) => this.toResponse(offer)),
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

  async getById(id: string): Promise<OfferResponseDto> {
    const offer = await this.findWithDestinationSummary(id);

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }

    return this.toResponse(offer);
  }

  async create(createOfferDto: CreateOfferDto, ownerId: string): Promise<OfferResponseDto> {
    const destination = await this.destinations.findOneBy({ id: createOfferDto.destinationId });

    if (!destination) {
      throw new NotFoundException(`Destination with id ${createOfferDto.destinationId} not found`);
    }

    const availableFrom = new Date(createOfferDto.availableFrom);
    const availableTo = new Date(createOfferDto.availableTo);

    if (availableTo <= availableFrom) {
      throw new BadRequestException("End date must be after start date");
    }

    const offer = await this.offers.save(
      this.offers.create({
        type: createOfferDto.type,
        destinationId: createOfferDto.destinationId,
        ownerId,
        title: createOfferDto.title,
        price: createOfferDto.price,
        currency: createOfferDto.currency,
        maxGuests: createOfferDto.maxGuests,
        maxConcurrentBookings: createOfferDto.maxConcurrentBookings,
        availableFrom,
        availableTo,
        status: createOfferDto.status || OfferStatus.active,
        description: createOfferDto.description || null,
        ...this.typeSpecificFields(createOfferDto.type, createOfferDto, {}),
      }),
    );

    // stage I returned the full destination on create
    return this.toResponse({ ...offer, destination });
  }

  async update(
    id: string,
    updateOfferDto: UpdateOfferDto,
    userId: string,
    role?: UserRole,
  ): Promise<OfferResponseDto> {
    const existingOffer = await this.offers.findOneBy({ id });

    if (!existingOffer) {
      throw new NotFoundException(`Offer with id ${id} not found or already deleted`);
    }

    if (role !== UserRole.Admin && existingOffer.ownerId !== userId) {
      throw new ForbiddenException("You can only update your own offers");
    }

    if (updateOfferDto.type && updateOfferDto.type !== existingOffer.type) {
      throw new BadRequestException("Cannot change offer type");
    }

    if (updateOfferDto.destinationId) {
      const destination = await this.destinations.findOneBy({ id: updateOfferDto.destinationId });

      if (!destination) {
        throw new NotFoundException(
          `Destination with id ${updateOfferDto.destinationId} not found`,
        );
      }
    }

    const availableFrom = updateOfferDto.availableFrom
      ? new Date(updateOfferDto.availableFrom)
      : existingOffer.availableFrom;
    const availableTo = updateOfferDto.availableTo
      ? new Date(updateOfferDto.availableTo)
      : existingOffer.availableTo;

    if (availableTo <= availableFrom) {
      throw new BadRequestException("End date must be after start date");
    }

    await this.offers.update(
      { id },
      {
        destinationId: updateOfferDto.destinationId ?? existingOffer.destinationId,
        title: updateOfferDto.title ?? existingOffer.title,
        description:
          updateOfferDto.description !== undefined
            ? updateOfferDto.description
            : existingOffer.description,
        price: updateOfferDto.price ?? existingOffer.price,
        currency: updateOfferDto.currency ?? existingOffer.currency,
        maxGuests: updateOfferDto.maxGuests ?? existingOffer.maxGuests,
        maxConcurrentBookings:
          updateOfferDto.maxConcurrentBookings ?? existingOffer.maxConcurrentBookings,
        availableFrom,
        availableTo,
        status: updateOfferDto.status ?? existingOffer.status,
        ...this.typeSpecificFields(existingOffer.type, updateOfferDto, existingOffer),
      },
    );

    const offer = await this.findWithDestinationSummary(id);

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }

    return this.toResponse(offer);
  }

  async delete(id: string, userId: string, role?: UserRole): Promise<void> {
    const offer = await this.offers.findOneBy({ id });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found or already deleted`);
    }

    // stage II behavior kept by decision: 409, not 403
    if (role !== UserRole.Admin && offer.ownerId !== userId) {
      throw new ConflictException("You can only delete your own offers");
    }

    // Soft delete: deletedAt hides the row from every find*(), status mirrors stage I
    await this.offers.update({ id }, { status: OfferStatus.archived, deletedAt: new Date() });
  }

  async hardDelete(id: string, userId: string, role?: UserRole): Promise<void> {
    const offer = await this.offers.findOne({ where: { id }, withDeleted: true });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found or already deleted`);
    }

    if (role !== UserRole.Admin && offer.ownerId !== userId) {
      throw new ConflictException("You can only delete your own offers");
    }

    await this.offers.delete({ id });
  }

  private findWithDestinationSummary(id: string): Promise<OfferEntity | null> {
    return this.offers.findOne({
      where: { id },
      relations: { destination: true },
      select: this.selectWithDestinationSummary(),
    });
  }

  // `select` with a relation lists every own column explicitly; reservedCapacity is internal, not selected
  private selectWithDestinationSummary() {
    return {
      id: true,
      type: true,
      destinationId: true,
      ownerId: true,
      title: true,
      description: true,
      price: true,
      currency: true,
      maxGuests: true,
      maxConcurrentBookings: true,
      availableFrom: true,
      availableTo: true,
      status: true,
      stars: true,
      address: true,
      flightNumber: true,
      airline: true,
      durationDays: true,
      includesMeals: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      destination: DESTINATION_SUMMARY,
    } as const;
  }

  // Fields of the other offer types are always null (stage I rule)
  private typeSpecificFields(
    type: OfferType,
    dto: Partial<TypeSpecificFields>,
    existing: Partial<TypeSpecificFields>,
  ): TypeSpecificFields {
    const pick = <K extends keyof TypeSpecificFields>(key: K): TypeSpecificFields[K] =>
      (dto[key] !== undefined ? dto[key] : existing[key]) ?? null;

    return {
      stars: type === OfferType.hotel ? pick("stars") : null,
      address: type === OfferType.hotel ? pick("address") : null,
      flightNumber: type === OfferType.flight ? pick("flightNumber") : null,
      airline: type === OfferType.flight ? pick("airline") : null,
      durationDays: type === OfferType.tour ? pick("durationDays") : null,
      includesMeals:
        type === OfferType.tour ? (dto.includesMeals ?? existing.includesMeals ?? false) : null,
    };
  }

  private toResponse(offer: OfferEntity): OfferResponseDto {
    // reservedCapacity is internal state of catalog-service, not part of the public contract
    const { reservedCapacity: _reservedCapacity, ...response } = offer;
    return response;
  }
}

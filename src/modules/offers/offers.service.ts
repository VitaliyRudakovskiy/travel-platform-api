import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { OfferResponseDto } from "./schemas/offer-response.schema";
import { CreateOfferDto } from "./schemas/create-offer-schema";
import { OfferStatus, OfferType } from "@prisma/client";
import { OfferQueryDto } from "./schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "./schemas/paginated-offer-response.schema";

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

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

    const where: any = {
      status: status || OfferStatus.active,
      deletedAt: null,
    };

    if (type) {
      where.type = type;
    }

    if (destinationId) {
      where.destinationId = destinationId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};

      if (minPrice) {
        where.price.gte = minPrice;
      }

      if (maxPrice) {
        where.price.lte = maxPrice;
      }
    }

    if (availableFrom || availableTo) {
      if (availableFrom && availableTo) {
        where.AND = [
          { availableFrom: { lte: new Date(availableTo) } },
          { availableTo: { gte: new Date(availableFrom) } },
        ];
      } else if (availableFrom) {
        where.availableTo = { gte: new Date(availableFrom) };
      } else if (availableTo) {
        where.availableFrom = { lte: new Date(availableTo) };
      }
    }

    const offers = await this.prisma.offer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            countryCode: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const data = offers.map((offer) => ({
      id: offer.id,
      type: offer.type,
      destinationId: offer.destinationId,
      ownerId: offer.ownerId,
      title: offer.title,
      description: offer.description,
      price: offer.price.toNumber(),
      currency: offer.currency,
      maxGuests: offer.maxGuests,
      maxConcurrentBookings: offer.maxConcurrentBookings,
      availableFrom: offer.availableFrom,
      availableTo: offer.availableTo,
      status: offer.status,
      stars: offer.stars,
      address: offer.address,
      flightNumber: offer.flightNumber,
      airline: offer.airline,
      durationDays: offer.durationDays,
      includesMeals: offer.includesMeals,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      deletedAt: offer.deletedAt,
      destination: offer.destination,
      owner: offer.user,
    }));

    const total = await this.prisma.offer.count({ where });
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data,
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

  async getById(id: string): Promise<OfferResponseDto> {
    const offer = await this.prisma.offer.findFirst({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }

    return {
      id: offer.id,
      type: offer.type,
      destinationId: offer.destinationId,
      ownerId: offer.ownerId,
      title: offer.title,
      description: offer.description,
      price: offer.price.toNumber(),
      currency: offer.currency,
      maxGuests: offer.maxGuests,
      maxConcurrentBookings: offer.maxConcurrentBookings,
      availableFrom: offer.availableFrom,
      availableTo: offer.availableTo,
      status: offer.status,
      stars: offer.stars,
      address: offer.address,
      flightNumber: offer.flightNumber,
      airline: offer.airline,
      durationDays: offer.durationDays,
      includesMeals: offer.includesMeals,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      deletedAt: offer.deletedAt,
    };
  }

  async create(createOfferDto: CreateOfferDto, ownerId: string): Promise<OfferResponseDto> {
    const destination = await this.prisma.destination.findUnique({
      where: { id: createOfferDto.destinationId },
    });

    if (!destination) {
      throw new NotFoundException(`Destination with id ${createOfferDto.destinationId} not found`);
    }

    const availableFrom = new Date(createOfferDto.availableFrom);
    const availableTo = new Date(createOfferDto.availableTo);

    if (availableTo <= availableFrom) {
      throw new BadRequestException("End date must be after start date");
    }

    const data: any = {
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
    };

    if (createOfferDto.type === OfferType.hotel) {
      data.stars = createOfferDto.stars;
      data.address = createOfferDto.address;

      data.airline = null;
      data.flightNumber = null;
      data.durationDays = null;
      data.includesMeals = null;
    } else if (createOfferDto.type === OfferType.flight) {
      data.airline = createOfferDto.airline;
      data.flightNumber = createOfferDto.flightNumber;

      data.stars = null;
      data.address = null;
      data.durationDays = null;
      data.includesMeals = null;
    } else if (createOfferDto.type === OfferType.tour) {
      data.durationDays = createOfferDto.durationDays;
      data.includesMeals = createOfferDto.includesMeals || false;

      data.stars = null;
      data.address = null;
      data.flightNumber = null;
      data.airline = null;
    }

    const offer = await this.prisma.offer.create({
      data,
      include: {
        destination: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return {
      id: offer.id,
      type: offer.type,
      destinationId: offer.destinationId,
      ownerId: offer.ownerId,
      title: offer.title,
      description: offer.description,
      price: offer.price.toNumber(),
      currency: offer.currency,
      maxGuests: offer.maxGuests,
      maxConcurrentBookings: offer.maxConcurrentBookings,
      availableFrom: offer.availableFrom,
      availableTo: offer.availableTo,
      status: offer.status,
      stars: offer.stars,
      address: offer.address,
      flightNumber: offer.flightNumber,
      airline: offer.airline,
      durationDays: offer.durationDays,
      includesMeals: offer.includesMeals,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
      deletedAt: offer.deletedAt,
    };
  }
}

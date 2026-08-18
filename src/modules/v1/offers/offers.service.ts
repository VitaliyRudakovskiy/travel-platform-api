import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { OfferResponseDto } from "./schemas/offer-response.schema";
import { CreateOfferDto } from "./schemas/create-offer.schema";
import { OfferStatus, OfferType } from "@prisma/client";
import { OfferQueryDto } from "./schemas/offer-query.schema";
import { PaginatedOfferResponseDto } from "./schemas/paginated-offer-response.schema";
import { UpdateOfferDto } from "./schemas/update-offer.schema";

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
      ...offer,
      price: offer.price.toNumber(),
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
      where: {
        id,
        deletedAt: null,
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

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }

    return {
      ...offer,
      price: offer.price.toNumber(),
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
      ...offer,
      price: offer.price.toNumber(),
    };
  }

  async update(
    id: string,
    updateOfferDto: UpdateOfferDto,
    userId: string,
  ): Promise<OfferResponseDto> {
    const existingOffer = await this.prisma.offer.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingOffer) {
      throw new NotFoundException(`Offer with id ${id} not found or already deleted`);
    }

    if (existingOffer.ownerId !== userId) {
      throw new ForbiddenException("You can only update your own offers");
    }

    if (updateOfferDto.type && updateOfferDto.type !== existingOffer.type) {
      throw new BadRequestException("Cannot change offer type");
    }

    if (updateOfferDto.destinationId) {
      const destination = await this.prisma.destination.findUnique({
        where: { id: updateOfferDto.destinationId },
      });

      if (!destination) {
        throw new NotFoundException(
          `Destination with id ${updateOfferDto.destinationId} not found`,
        );
      }
    }

    let availableFrom = existingOffer.availableFrom;
    let availableTo = existingOffer.availableTo;

    if (updateOfferDto.availableFrom) {
      availableFrom = new Date(updateOfferDto.availableFrom);
    }

    if (updateOfferDto.availableTo) {
      availableTo = new Date(updateOfferDto.availableTo);
    }

    if (availableTo <= availableFrom) {
      throw new BadRequestException("End date must be after start date");
    }

    const data: any = {
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
    };

    const type = existingOffer.type;

    if (type === OfferType.hotel) {
      data.stars = updateOfferDto.stars !== undefined ? updateOfferDto.stars : existingOffer.stars;
      data.address =
        updateOfferDto.address !== undefined ? updateOfferDto.address : existingOffer.address;

      data.flightNumber = null;
      data.airline = null;
      data.durationDays = null;
      data.includesMeals = null;
    } else if (type === OfferType.flight) {
      data.flightNumber =
        updateOfferDto.flightNumber !== undefined
          ? updateOfferDto.flightNumber
          : existingOffer.flightNumber;
      data.airline =
        updateOfferDto.airline !== undefined ? updateOfferDto.airline : existingOffer.airline;

      data.stars = null;
      data.address = null;
      data.durationDays = null;
      data.includesMeals = null;
    } else if (type === OfferType.tour) {
      data.durationDays =
        updateOfferDto.durationDays !== undefined
          ? updateOfferDto.durationDays
          : existingOffer.durationDays;
      data.includesMeals =
        updateOfferDto.includesMeals !== undefined
          ? updateOfferDto.includesMeals
          : existingOffer.includesMeals;

      data.stars = null;
      data.address = null;
      data.flightNumber = null;
      data.airline = null;
    }

    const offer = await this.prisma.offer.update({
      where: { id },
      data,
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

    return {
      ...offer,
      price: offer.price.toNumber(),
    };
  }

  async delete(id: string, userId: string): Promise<void> {
    const offer = await this.prisma.offer.findUnique({
      where: { id, deletedAt: null },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found or already deleted`);
    }

    if (offer.ownerId !== userId) {
      throw new ConflictException("You can only delete your own offers");
    }

    await this.prisma.offer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: OfferStatus.archived,
      },
    });
  }

  async hardDelete(id: string, userId: string): Promise<void> {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found or already deleted`);
    }

    if (offer.ownerId !== userId) {
      throw new ConflictException("You can only delete your own offers");
    }

    await this.prisma.offer.delete({
      where: { id },
    });
  }
}

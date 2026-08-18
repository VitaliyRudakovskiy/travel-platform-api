import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { CreateBookingDto } from "./schemas/create-booking.schema";
import { BookingResponseDto } from "./schemas/booking-response.schema";
import { BookingStatus, OfferStatus } from "@prisma/client";
import { BookingQueryDto } from "./schemas/booking-query.schema";
import { PaginatedBookingResponseDto } from "./schemas/paginated-booking-response.schema";
import { UpdateBookingStatusDto } from "./schemas/update-booking.schema";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyBookings(
    query: BookingQueryDto,
    userId: string,
  ): Promise<PaginatedBookingResponseDto> {
    const { page, limit, status } = query;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const total = await this.prisma.booking.count({ where });

    const bookings = await this.prisma.booking.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        offer: {
          include: {
            destination: true,
          },
        },
      },
    });

    const data = bookings.map((booking) => ({
      ...booking,
      totalPrice: booking.totalPrice.toNumber(),
      offer: {
        ...booking.offer,
        price: booking.offer.price.toNumber(),
      },
    }));

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

  async getById(bookingId: string, userId: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        offer: {
          include: {
            destination: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException("You can only access your own bookings");
    }

    return {
      ...booking,
      totalPrice: booking.totalPrice.toNumber(),
      offer: {
        ...booking.offer,
        price: booking.offer.price.toNumber(),
      },
    };
  }

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<BookingResponseDto> {
    const existingOffer = await this.prisma.offer.findFirst({
      where: {
        id: createBookingDto.offerId,
        status: OfferStatus.active,
        deletedAt: null,
      },
    });

    if (!existingOffer) {
      throw new NotFoundException(
        `Offer with id ${createBookingDto.offerId} not found or not active`,
      );
    }

    const startDate = new Date(createBookingDto.startDate);
    const endDate = new Date(createBookingDto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException("End date must be after start date");
    }

    if (startDate < existingOffer.availableFrom || endDate > existingOffer.availableTo) {
      throw new BadRequestException(
        `Booking dates must be within ${existingOffer.availableFrom.toISOString()} - ${existingOffer.availableTo.toISOString()}`,
      );
    }

    if (createBookingDto.guestsCount > existingOffer.maxGuests) {
      throw new BadRequestException(
        `Guests count ${createBookingDto.guestsCount} exceeds maximum ${existingOffer.maxGuests}`,
      );
    }

    const overlappingBookings = await this.prisma.booking.count({
      where: {
        offerId: createBookingDto.offerId,
        status: BookingStatus.confirmed,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlappingBookings >= existingOffer.maxConcurrentBookings) {
      throw new ConflictException(
        `No available slots for these dates. Maximum concurrent bookings ${existingOffer.maxConcurrentBookings} reached.`,
      );
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const durationDays = Math.max(daysDiff, 1);
    const totalPrice = existingOffer.price.toNumber() * durationDays * createBookingDto.guestsCount;

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        offerId: createBookingDto.offerId,
        startDate,
        endDate,
        guestsCount: createBookingDto.guestsCount,
        totalPrice,
        status: BookingStatus.draft,
      },
      include: {
        offer: {
          include: {
            destination: true,
          },
        },
      },
    });

    return {
      ...booking,
      totalPrice: booking.totalPrice.toNumber(),
      offer: {
        ...booking.offer,
        price: booking.offer.price.toNumber(),
        destination: {
          ...booking.offer.destination,
        },
      },
    };
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateBookingStatusDto,
    userId: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        offer: {
          include: {
            destination: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException("You can only update your own bookings");
    }

    const currentStatus = booking.status;
    const newStatus = updateStatusDto.status;

    if (newStatus === BookingStatus.confirmed && currentStatus !== BookingStatus.draft) {
      throw new BadRequestException("Booking can only be confirmed from draft status");
    }

    if (newStatus === BookingStatus.cancelled) {
      if (currentStatus !== BookingStatus.draft && currentStatus !== BookingStatus.confirmed) {
        throw new BadRequestException(
          "Booking can only be cancelled from draft or confirmed status",
        );
      }
    }

    if (newStatus === BookingStatus.confirmed) {
      const offer = await this.prisma.offer.findFirst({
        where: {
          id: booking.offerId,
          status: "active",
          deletedAt: null,
        },
      });

      if (!offer) {
        throw new ConflictException("Cannot confirm booking. Offer is no longer active");
      }

      if (booking.startDate < offer.availableFrom || booking.endDate > offer.availableTo) {
        throw new ConflictException(
          "Cannot confirm booking. Dates are outside of offer availability period",
        );
      }

      const overlappingBookings = await this.prisma.booking.count({
        where: {
          offerId: booking.offerId,
          status: "confirmed",
          id: { not: booking.id },
          OR: [
            {
              startDate: { lte: booking.endDate },
              endDate: { gte: booking.startDate },
            },
          ],
        },
      });

      if (overlappingBookings >= offer.maxConcurrentBookings) {
        throw new ConflictException(
          `Cannot confirm booking. Maximum concurrent bookings (${offer.maxConcurrentBookings}) reached for these dates`,
        );
      }
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: newStatus,
      },
      include: {
        offer: {
          include: {
            destination: true,
          },
        },
      },
    });

    return {
      ...updatedBooking,
      totalPrice: updatedBooking.totalPrice.toNumber(),
      offer: {
        ...updatedBooking.offer,
        price: updatedBooking.offer.price.toNumber(),
      },
    };
  }
}

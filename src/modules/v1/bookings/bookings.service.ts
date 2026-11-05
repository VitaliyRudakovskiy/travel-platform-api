import { createHash } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { CreateBookingDto } from "./schemas/create-booking.schema";
import { BookingResponseDto } from "./schemas/booking-response.schema";
import {
  BookingStatus,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  OfferStatus,
  type Prisma,
  UserRole,
} from "#prisma";
import { BookingQueryDto } from "./schemas/booking-query.schema";
import { PaginatedBookingResponseDto } from "./schemas/paginated-booking-response.schema";
import { UpdateBookingStatusDto } from "./schemas/update-booking.schema";
import {
  fromV1BookingStatus,
  toV1BookingStatus,
  type V1BookingStatus,
} from "./models/v1-booking-status";
import { createBookingState } from "./states/booking-state";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyBookings(
    query: BookingQueryDto | { page: number; limit: number; status?: string },
    userId: string,
    role?: UserRole,
    nativeStatus = false,
  ): Promise<PaginatedBookingResponseDto> {
    const { page, limit, status } = query;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const where: Prisma.BookingWhereInput = this.bookingListScope(userId, role);

    if (status) {
      where.status = nativeStatus
        ? (status as BookingStatus)
        : fromV1BookingStatus(status as V1BookingStatus);
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
      status: this.mapStatus(booking.status, nativeStatus),
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

  async getById(
    bookingId: string,
    userId: string,
    role?: UserRole,
    nativeStatus = false,
  ): Promise<BookingResponseDto> {
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

    if (!this.canViewBooking(booking, userId, role)) {
      throw new ForbiddenException("You can only access your own bookings");
    }

    return {
      ...booking,
      status: this.mapStatus(booking.status, nativeStatus),
      totalPrice: booking.totalPrice.toNumber(),
      offer: {
        ...booking.offer,
        price: booking.offer.price.toNumber(),
      },
    };
  }

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
    idempotencyKey?: string,
  ): Promise<BookingResponseDto> {
    if (idempotencyKey) {
      await this.assertIdempotency(userId, idempotencyKey, createBookingDto);
    }
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

    const bookingInclude = {
      offer: {
        include: {
          destination: true,
        },
      },
    };

    const booking = idempotencyKey
      ? await this.prisma.$transaction(async (tx) => {
          const created = await tx.booking.create({
            data: {
              userId,
              offerId: createBookingDto.offerId,
              startDate,
              endDate,
              guestsCount: createBookingDto.guestsCount,
              totalPrice,
              status: BookingStatus.pending,
            },
            include: bookingInclude,
          });

          await tx.idempotencyKey.create({
            data: {
              key: idempotencyKey,
              requestHash: hashRequest(createBookingDto),
              userId,
              bookingId: created.id,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
          });

          return created;
        })
      : await this.prisma.booking.create({
          data: {
            userId,
            offerId: createBookingDto.offerId,
            startDate,
            endDate,
            guestsCount: createBookingDto.guestsCount,
            totalPrice,
            status: BookingStatus.pending,
          },
          include: bookingInclude,
        });

    return {
      ...booking,
      status: this.mapStatus(booking.status, Boolean(idempotencyKey)),
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
    role?: UserRole,
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

    if (!this.canMutateBooking(booking, userId, role)) {
      throw new ForbiddenException("You can only update your own bookings");
    }

    const currentStatus = booking.status;
    const newStatus = updateStatusDto.status;

    if (newStatus === BookingStatus.confirmed && currentStatus !== BookingStatus.pending) {
      throw new BadRequestException("Booking can only be confirmed from pending status");
    }

    if (newStatus === BookingStatus.cancelled) {
      if (currentStatus !== BookingStatus.pending && currentStatus !== BookingStatus.confirmed) {
        throw new BadRequestException(
          "Booking can only be cancelled from pending or confirmed status",
        );
      }
    }

    if (newStatus === BookingStatus.confirmed) {
      await this.assertCanConfirm(booking);
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
      status: toV1BookingStatus(updatedBooking.status),
      totalPrice: updatedBooking.totalPrice.toNumber(),
      offer: {
        ...updatedBooking.offer,
        price: updatedBooking.offer.price.toNumber(),
      },
    };
  }

  async changeStatus(
    id: string,
    updateStatusDto: { status: BookingStatus },
    userId: string,
    role?: UserRole,
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

    if (!this.canMutateBooking(booking, userId, role)) {
      throw new ForbiddenException("You can only update your own bookings");
    }

    const newStatus = createBookingState(booking.status).transitionTo(updateStatusDto.status);

    if (newStatus === BookingStatus.confirmed) {
      await this.assertCanConfirm(booking);
    }

    const notificationType = notificationTypeFor(newStatus);

    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: newStatus },
        include: {
          offer: {
            include: {
              destination: true,
            },
          },
        },
      });

      if (notificationType) {
        await tx.notification.create({
          data: {
            userId: booking.userId,
            type: notificationType,
            channel: NotificationChannel.email,
            status: NotificationStatus.pending,
            payload: { bookingId: booking.id },
          },
        });
      }

      return updated;
    });

    return {
      ...updatedBooking,
      status: this.mapStatus(updatedBooking.status, true),
      totalPrice: updatedBooking.totalPrice.toNumber(),
      offer: {
        ...updatedBooking.offer,
        price: updatedBooking.offer.price.toNumber(),
      },
    };
  }

  private bookingListScope(userId: string, role?: UserRole): Prisma.BookingWhereInput {
    if (role === UserRole.Admin) {
      return {};
    }

    if (role === UserRole.Agent) {
      return { offer: { ownerId: userId } };
    }

    return { userId };
  }

  private canViewBooking(
    booking: { userId: string; offer: { ownerId: string } },
    userId: string,
    role?: UserRole,
  ): boolean {
    if (role === UserRole.Admin || booking.userId === userId) {
      return true;
    }

    return role === UserRole.Agent && booking.offer.ownerId === userId;
  }

  private canMutateBooking(booking: { userId: string }, userId: string, role?: UserRole): boolean {
    return role === UserRole.Admin || booking.userId === userId;
  }

  private mapStatus(status: BookingStatus, nativeStatus = false): BookingResponseDto["status"] {
    return (nativeStatus ? status : toV1BookingStatus(status)) as BookingResponseDto["status"];
  }

  private async assertCanConfirm(booking: {
    id: string;
    offerId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<void> {
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

  private async assertIdempotency(
    userId: string,
    key: string,
    createBookingDto: CreateBookingDto,
  ): Promise<void> {
    const existing = await this.prisma.idempotencyKey.findUnique({
      where: {
        userId_key: { userId, key },
      },
    });

    if (!existing) {
      return;
    }

    if (existing.expiresAt <= new Date()) {
      await this.prisma.idempotencyKey.delete({
        where: { id: existing.id },
      });
      return;
    }

    if (existing.requestHash === hashRequest(createBookingDto)) {
      throw new ConflictException({
        message: "Idempotent request replay",
        errors: { bookingId: existing.bookingId },
      });
    }

    throw new ConflictException("Idempotency key was already used with a different request body");
  }
}

function hashRequest(createBookingDto: CreateBookingDto): string {
  return createHash("sha256").update(JSON.stringify(createBookingDto)).digest("hex");
}

function notificationTypeFor(status: BookingStatus): NotificationType | null {
  if (status === BookingStatus.confirmed) {
    return NotificationType.booking_confirmed;
  }

  if (status === BookingStatus.cancelled) {
    return NotificationType.booking_cancelled;
  }

  if (status === BookingStatus.completed) {
    return NotificationType.booking_completed;
  }

  return null;
}

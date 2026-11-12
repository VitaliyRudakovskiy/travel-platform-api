import { createHash } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { type AvailabilityResponseDto, type OfferInfo, UnavailabilityReason } from "@app/contracts";
import { UserRole } from "@app/common";
import { type Booking, BookingStatus, Prisma } from "#booking-prisma";
import { PrismaService } from "../../../prisma/prisma.service";
import { CatalogClient } from "../../catalog-client/catalog-client.service";
import { type OfferSummary, toOfferSummary } from "../../offer-summary/offer-summary";
import {
  bookingCreatedOutboxEvent,
  bookingStatusChangedOutboxEvent,
} from "../../outbox/booking-outbox-events";
import { CreateBookingDto } from "./schemas/create-booking.schema";
import { BookingResponseDto } from "./schemas/booking-response.schema";
import { BookingQueryDto } from "./schemas/booking-query.schema";
import { PaginatedBookingResponseDto } from "./schemas/paginated-booking-response.schema";
import { UpdateBookingStatusDto } from "./schemas/update-booking.schema";
import {
  fromV1BookingStatus,
  toV1BookingStatus,
  type V1BookingStatus,
} from "./models/v1-booking-status";
import { createBookingState } from "./states/booking-state";

const IDEMPOTENCY_KEY_TTL_MS = 24 * 60 * 60 * 1000;
const RELEASING_STATUSES: BookingStatus[] = [BookingStatus.cancelled, BookingStatus.completed];

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogClient,
  ) {}

  async getMyBookings(
    query: BookingQueryDto | { page: number; limit: number; status?: string },
    userId: string,
    role?: UserRole,
    nativeStatus = false,
  ): Promise<PaginatedBookingResponseDto> {
    const { page, limit, status } = query;

    // The gateway guarantees the user exists (stage II looked it up in the same database).
    const where: Prisma.BookingWhereInput = this.bookingListScope(userId, role);

    if (status) {
      where.status = nativeStatus
        ? (status as BookingStatus)
        : fromV1BookingStatus(status as V1BookingStatus);
    }

    const [total, bookings] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const offers = await this.offerSummaries(bookings.map((booking) => booking.offerId));
    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings.map((booking) =>
        this.toResponse(booking, offers.get(booking.offerId), nativeStatus),
      ),
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

  async getById(
    bookingId: string,
    userId: string,
    role?: UserRole,
    nativeStatus = false,
  ): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    if (!this.canViewBooking(booking, userId, role)) {
      throw new ForbiddenException("You can only access your own bookings");
    }

    const offers = await this.offerSummaries([booking.offerId]);

    return this.toResponse(booking, offers.get(booking.offerId), nativeStatus);
  }

  /**
   * Orchestration of a booking (spec 3.4). booking-service drives the process and undoes, in catalog-service,
   * what it already did there if a later step fails (compensation, not a distributed transaction):
   *   1. X-Email-Verified (v2)            -> EmailVerifiedGuard in the controller
   *   2. availability                     -> catalog HTTP GET  /internal/v1/offers/:id/availability
   *   3. reserve a slot                   -> catalog HTTP PATCH /internal/v1/offers/:id/capacity { +1 }
   *   4. booking (pending)                ┐ one booking_db transaction
   *   5. outbox event `booking.created`   ┘
   *   6. failure at 3–5                   -> catalog HTTP PATCH capacity { -1 }
   */
  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
    idempotencyKey?: string,
  ): Promise<BookingResponseDto> {
    // Before touching the catalog: a replayed request must not hold a second slot even for a moment.
    if (idempotencyKey) {
      await this.assertIdempotency(userId, idempotencyKey, createBookingDto);
    }

    const { offerId, guestsCount } = createBookingDto;
    const offer = await this.getActiveOffer(offerId); // gRPC: price, owner, title

    const availability = await this.catalog
      .checkAvailability(offerId, {
        startDate: createBookingDto.startDate,
        endDate: createBookingDto.endDate,
        guestsCount,
      })
      .catch((error: unknown) => {
        throw error instanceof NotFoundException ? offerNotFound(offerId) : error;
      });

    if (!availability.available) {
      throw unavailabilityError(availability, offerId);
    }

    const startDate = new Date(createBookingDto.startDate);
    const endDate = new Date(createBookingDto.endDate);
    const totalPrice = Number(offer.price) * bookingDays(startDate, endDate) * guestsCount;

    await this.reserveSlot(offerId);

    let booking: Booking;

    try {
      booking = await this.prisma.$transaction(async (tx) => {
        const created = await tx.booking.create({
          data: {
            userId,
            offerId,
            offerOwnerId: offer.ownerId,
            startDate,
            endDate,
            guestsCount,
            totalPrice,
            status: BookingStatus.pending,
          },
        });

        if (idempotencyKey) {
          await tx.idempotencyKey.create({
            data: {
              key: idempotencyKey,
              requestHash: hashRequest(createBookingDto),
              userId,
              bookingId: created.id,
              expiresAt: new Date(Date.now() + IDEMPOTENCY_KEY_TTL_MS),
            },
          });
        }

        await tx.outboxEvent.create({ data: bookingCreatedOutboxEvent(created, offer.title) });

        return created;
      });
    } catch (error) {
      await this.compensateReservation(offerId, error);

      // A concurrent request with the same key won the unique (user_id, key) race -> 409 with its bookingId
      if (idempotencyKey && isUniqueViolation(error)) {
        await this.assertIdempotency(userId, idempotencyKey, createBookingDto);
      }

      throw error;
    }

    this.logger.log(
      `Booking ${booking.id} created: user=${userId} offer=${booking.offerId} status=${booking.status}`,
    );

    return this.toResponse(booking, toOfferSummary(offer), Boolean(idempotencyKey));
  }

  // v1: stage I transition rules (400 on an illegal transition), v1 status vocabulary in the response
  async updateStatus(
    id: string,
    updateStatusDto: UpdateBookingStatusDto,
    userId: string,
    role?: UserRole,
  ): Promise<BookingResponseDto> {
    const booking = await this.findMutableBooking(id, userId, role);
    const currentStatus = booking.status;
    const newStatus = updateStatusDto.status as BookingStatus;

    if (newStatus === BookingStatus.confirmed && currentStatus !== BookingStatus.pending) {
      throw new BadRequestException("Booking can only be confirmed from pending status");
    }

    if (
      newStatus === BookingStatus.cancelled &&
      currentStatus !== BookingStatus.pending &&
      currentStatus !== BookingStatus.confirmed
    ) {
      throw new BadRequestException(
        "Booking can only be cancelled from pending or confirmed status",
      );
    }

    return this.applyStatusChange(booking, newStatus, userId, false);
  }

  // v2: State pattern (409 on an illegal transition), native status vocabulary
  async changeStatus(
    id: string,
    updateStatusDto: { status: BookingStatus },
    userId: string,
    role?: UserRole,
  ): Promise<BookingResponseDto> {
    const booking = await this.findMutableBooking(id, userId, role);
    const newStatus = createBookingState(booking.status).transitionTo(updateStatusDto.status);

    return this.applyStatusChange(booking, newStatus, userId, true);
  }

  private async applyStatusChange(
    booking: Booking,
    newStatus: BookingStatus,
    actorId: string,
    nativeStatus: boolean,
  ): Promise<BookingResponseDto> {
    // Best effort: the title goes into the event, the summary into the response. Only confirming needs it.
    const offer = await this.tryGetOffer(booking.offerId);

    if (newStatus === BookingStatus.confirmed) {
      this.assertCanConfirm(booking, offer);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.booking.update({
        where: { id: booking.id },
        data: { status: newStatus },
      });

      // Every transition is an event (spec 3.4); notification-service turns it into notifications.
      await tx.outboxEvent.create({
        data: bookingStatusChangedOutboxEvent(booking, booking.status, newStatus, offer?.title),
      });

      return result;
    });

    this.logStatusChange(booking.id, booking.status, newStatus, actorId);

    const released = await this.releaseCapacityIfNeeded(updated);

    return this.toResponse(released, offer ? toOfferSummary(offer) : undefined, nativeStatus);
  }

  /**
   * A cancelled or completed booking gives its slot back (capacity is a counter without dates, decision D3).
   * Done after the commit: the status change itself must not depend on catalog-service. If the call fails,
   * the flag stays false and the slot remains reserved until released manually (logged as an error).
   */
  private async releaseCapacityIfNeeded(booking: Booking): Promise<Booking> {
    if (!RELEASING_STATUSES.includes(booking.status) || booking.capacityReleased) {
      return booking;
    }

    try {
      await this.catalog.release(booking.offerId);
    } catch (error) {
      if (!(error instanceof ConflictException)) {
        this.logger.error(
          `Booking ${booking.id}: slot of offer ${booking.offerId} was not released: ${describe(error)}`,
        );
        return booking;
      }
      // 409: nothing reserved for this offer (e.g. booked before capacity tracking) -> nothing to give back
    }

    return this.prisma.booking.update({
      where: { id: booking.id },
      data: { capacityReleased: true },
    });
  }

  private async reserveSlot(offerId: string): Promise<void> {
    try {
      await this.catalog.reserve(offerId);
    } catch (error) {
      // 409 (last slot taken meanwhile) / 404: nothing was reserved, nothing to undo.
      // 503 may be a timeout AFTER catalog applied +1: compensate (spec: failure at step 3).
      // The atomic UPDATE in catalog never lets the counter go below zero.
      if (error instanceof ServiceUnavailableException) {
        await this.compensateReservation(offerId, error);
      }

      throw error instanceof NotFoundException ? offerNotFound(offerId) : error;
    }
  }

  private async compensateReservation(offerId: string, cause: unknown): Promise<void> {
    try {
      await this.catalog.release(offerId);
      this.logger.warn(`Reservation of offer ${offerId} compensated after: ${describe(cause)}`);
    } catch (error) {
      // Never hide the original error. The slot may stay reserved: needs manual reconciliation.
      this.logger.error(
        `Compensation for offer ${offerId} failed (slot may stay reserved): ${describe(error)}`,
      );
    }
  }

  private async getActiveOffer(offerId: string): Promise<OfferInfo> {
    const offer = await this.catalog.getOffer(offerId).catch((error: unknown) => {
      throw error instanceof NotFoundException ? offerNotFound(offerId) : error;
    });

    if (offer.deleted) {
      throw offerNotFound(offerId);
    }

    return offer;
  }

  private async tryGetOffer(offerId: string): Promise<OfferInfo | undefined> {
    try {
      return await this.catalog.getOffer(offerId);
    } catch {
      return undefined;
    }
  }

  // Embedded `offer` is optional in the contract: if catalog-service is down, return bookings without it.
  private async offerSummaries(offerIds: string[]): Promise<Map<string, OfferSummary>> {
    try {
      const offers = await this.catalog.getOffersByIds(offerIds);
      return new Map([...offers].map(([id, offer]) => [id, toOfferSummary(offer)]));
    } catch (error) {
      this.logger.warn(`Bookings returned without offer details: ${describe(error)}`);
      return new Map();
    }
  }

  private async findMutableBooking(id: string, userId: string, role?: UserRole): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    if (!this.canMutateBooking(booking, userId, role)) {
      throw new ForbiddenException("You can only update your own bookings");
    }

    return booking;
  }

  private assertCanConfirm(booking: Booking, offer: OfferInfo | undefined): void {
    if (!offer) {
      throw new ServiceUnavailableException("Catalog service is unavailable");
    }

    if (offer.deleted || offer.status !== "active") {
      throw new ConflictException("Cannot confirm booking. Offer is no longer active");
    }

    if (
      booking.startDate < new Date(offer.availableFrom) ||
      booking.endDate > new Date(offer.availableTo)
    ) {
      throw new ConflictException(
        "Cannot confirm booking. Dates are outside of offer availability period",
      );
    }
    // No overlap count any more: the slot was reserved in catalog-service when the booking was created.
  }

  // Logged after the DB write succeeds, so the log never reports a change that was rolled back.
  private logStatusChange(
    bookingId: string,
    from: BookingStatus,
    to: BookingStatus,
    actorId: string,
  ): void {
    if (to === BookingStatus.cancelled) {
      this.logger.log(`Booking ${bookingId} cancelled: ${from} -> ${to} by user=${actorId}`);
      return;
    }

    this.logger.log(`Booking ${bookingId} status changed: ${from} -> ${to} by user=${actorId}`);
  }

  private bookingListScope(userId: string, role?: UserRole): Prisma.BookingWhereInput {
    if (role === UserRole.Admin) {
      return {};
    }

    if (role === UserRole.Agent) {
      return { offerOwnerId: userId };
    }

    return { userId };
  }

  private canViewBooking(booking: Booking, userId: string, role?: UserRole): boolean {
    if (role === UserRole.Admin || booking.userId === userId) {
      return true;
    }

    return role === UserRole.Agent && booking.offerOwnerId === userId;
  }

  private canMutateBooking(booking: Booking, userId: string, role?: UserRole): boolean {
    return role === UserRole.Admin || booking.userId === userId;
  }

  // Only contract fields: offerOwnerId / capacityReleased are internal to booking-service
  private toResponse(
    booking: Booking,
    offer: OfferSummary | undefined,
    nativeStatus: boolean,
  ): BookingResponseDto {
    return {
      id: booking.id,
      userId: booking.userId,
      offerId: booking.offerId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      guestsCount: booking.guestsCount,
      totalPrice: booking.totalPrice.toNumber(),
      status: (nativeStatus
        ? booking.status
        : toV1BookingStatus(booking.status)) as BookingResponseDto["status"],
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      ...(offer ? { offer } : {}),
    };
  }

  private async assertIdempotency(
    userId: string,
    key: string,
    createBookingDto: CreateBookingDto,
  ): Promise<void> {
    const existing = await this.prisma.idempotencyKey.findUnique({
      where: { userId_key: { userId, key } },
    });

    if (!existing) {
      return;
    }

    if (existing.expiresAt <= new Date()) {
      await this.prisma.idempotencyKey.delete({ where: { id: existing.id } });
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

// catalog-service answers 200 + reason; keep the stage I/II status codes for the client
function unavailabilityError(
  availability: AvailabilityResponseDto,
  offerId: string,
): HttpException {
  const message = availability.message ?? "Offer is not available";

  switch (availability.reason) {
    case UnavailabilityReason.OFFER_NOT_ACTIVE:
      return offerNotFound(offerId);
    case UnavailabilityReason.NO_CAPACITY:
      return new ConflictException(message);
    default:
      return new BadRequestException(message);
  }
}

function offerNotFound(offerId: string): NotFoundException {
  return new NotFoundException(`Offer with id ${offerId} not found or not active`);
}

function bookingDays(startDate: Date, endDate: Date): number {
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error as Prisma.PrismaClientKnownRequestError).code === "P2002"
  );
}

function hashRequest(createBookingDto: CreateBookingDto): string {
  return createHash("sha256").update(JSON.stringify(createBookingDto)).digest("hex");
}

// Prisma driver-adapter errors may have an empty message: fall back to the code / class name
function describe(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const code = (error as { code?: unknown }).code;
  return error.message || (code ? `${error.name} (${String(code)})` : error.name);
}

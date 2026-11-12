import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import {
  type AvailabilityQueryDto,
  type AvailabilityResponseDto,
  type CapacityResponseDto,
  type OfferInfo,
  UnavailabilityReason,
} from "@app/contracts";
import { OfferEntity } from "../../v1/offers/entities/offer.entity";
import { OfferStatus } from "../../v1/offers/models/offer.enums";

// Business logic of the internal API used by booking-service (HTTP /internal/v1 and gRPC).
@Injectable()
export class InternalOffersService {
  constructor(
    @InjectRepository(OfferEntity)
    private readonly offers: Repository<OfferEntity>,
  ) {}

  // Same rules as the stage II BookingsService.create, minus the booking count:
  // capacity is now a counter of reserved slots kept by catalog-service (decision D3).
  async checkAvailability(
    offerId: string,
    query: AvailabilityQueryDto,
  ): Promise<AvailabilityResponseDto> {
    const offer = await this.offers.findOneBy({ id: offerId });

    if (!offer) {
      throw new NotFoundException(`Offer with id ${offerId} not found`);
    }

    const remainingCapacity = offer.maxConcurrentBookings - offer.reservedCapacity;
    const unavailable = (reason: UnavailabilityReason, message: string) => ({
      available: false,
      remainingCapacity,
      reason,
      message,
    });

    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    if (offer.status !== OfferStatus.active) {
      return unavailable(
        UnavailabilityReason.OFFER_NOT_ACTIVE,
        `Offer with id ${offerId} is not active`,
      );
    }

    if (startDate >= endDate) {
      return unavailable(UnavailabilityReason.INVALID_DATES, "End date must be after start date");
    }

    if (startDate < offer.availableFrom || endDate > offer.availableTo) {
      return unavailable(
        UnavailabilityReason.DATES_OUT_OF_RANGE,
        `Booking dates must be within ${offer.availableFrom.toISOString()} - ${offer.availableTo.toISOString()}`,
      );
    }

    if (query.guestsCount > offer.maxGuests) {
      return unavailable(
        UnavailabilityReason.GUESTS_EXCEEDED,
        `Guests count ${query.guestsCount} exceeds maximum ${offer.maxGuests}`,
      );
    }

    if (remainingCapacity <= 0) {
      return unavailable(
        UnavailabilityReason.NO_CAPACITY,
        `No available slots. Maximum concurrent bookings ${offer.maxConcurrentBookings} reached.`,
      );
    }

    return { available: true, remainingCapacity };
  }

  // +1 reserves a slot, -1 releases it (compensation / cancellation).
  // One atomic UPDATE: two concurrent reservations of the last slot cannot both succeed,
  // unlike "read -> check -> write". The CHECK constraint on the column is a second safety net.
  async changeCapacity(offerId: string, reservedDelta: 1 | -1): Promise<CapacityResponseDto> {
    const result = await this.offers
      .createQueryBuilder()
      .update(OfferEntity)
      .set({ reservedCapacity: () => "reserved_capacity + :delta" })
      .where("id = :id")
      .andWhere("deleted_at IS NULL")
      .andWhere("reserved_capacity + :delta BETWEEN 0 AND max_concurrent_bookings")
      .setParameters({ id: offerId, delta: reservedDelta })
      // returning() takes entity PROPERTY names; result.raw rows come back with DB COLUMN names.
      // (Column names here silently produce an empty RETURNING list.)
      .returning(["maxConcurrentBookings", "reservedCapacity"])
      .execute();

    if (!result.affected) {
      const exists = await this.offers.existsBy({ id: offerId });

      if (!exists) {
        throw new NotFoundException(`Offer with id ${offerId} not found`);
      }

      throw new ConflictException(
        reservedDelta > 0 ? "No capacity left for this offer" : "No reserved capacity to release",
      );
    }

    const [row] = result.raw as { max_concurrent_bookings: number; reserved_capacity: number }[];

    return { remainingCapacity: row.max_concurrent_bookings - row.reserved_capacity };
  }

  async getOffer(id: string): Promise<OfferInfo | null> {
    const offer = await this.offers.findOne({
      where: { id },
      relations: { destination: true },
      withDeleted: true,
    });

    return offer ? this.toOfferInfo(offer) : null;
  }

  async getOffersByIds(ids: string[]): Promise<OfferInfo[]> {
    if (ids.length === 0) {
      return [];
    }

    // withDeleted: bookings/favorites may point to an offer deleted later; `deleted` tells the caller
    const offers = await this.offers.find({
      where: { id: In(ids) },
      relations: { destination: true },
      withDeleted: true,
    });

    return offers.map((offer) => this.toOfferInfo(offer));
  }

  async listOfferIdsByOwner(ownerId: string): Promise<string[]> {
    const offers = await this.offers.find({
      where: { ownerId },
      select: { id: true },
      withDeleted: true,
    });

    return offers.map((offer) => offer.id);
  }

  private toOfferInfo(offer: OfferEntity): OfferInfo {
    return {
      id: offer.id,
      ownerId: offer.ownerId,
      title: offer.title,
      type: offer.type,
      price: offer.price.toFixed(2),
      currency: offer.currency,
      destinationId: offer.destinationId,
      destinationName: offer.destination?.name ?? "",
      status: offer.status,
      maxGuests: offer.maxGuests,
      maxConcurrentBookings: offer.maxConcurrentBookings,
      availableFrom: offer.availableFrom.toISOString(),
      availableTo: offer.availableTo.toISOString(),
      deleted: offer.deletedAt !== null,
    };
  }
}

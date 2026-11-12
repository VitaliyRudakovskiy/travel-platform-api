import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CatalogClient } from "../../catalog-client/catalog-client.service";
import { BookingStatus } from "#booking-prisma";
import { type BookingAnalyticsQueryDto } from "./schemas/booking-analytics-query.schema";
import {
  type BookingAnalyticsItemDto,
  type BookingAnalyticsResponseDto,
} from "./schemas/booking-analytics-response.schema";

type Period = { start: Date; end: Date };

const UNKNOWN_DESTINATION = { key: "unknown", label: "Unknown destination" };

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogClient,
  ) {}

  async getBookingStats(query: BookingAnalyticsQueryDto): Promise<BookingAnalyticsResponseDto> {
    const { from, to, groupBy, limit } = query;
    const period = this.toPeriod(from, to);

    const data =
      groupBy === "status"
        ? await this.countByStatus(period, limit)
        : await this.countByDestination(period, limit);

    return { groupBy, from, to, data };
  }

  private async countByStatus(
    { start, end }: Period,
    limit: number,
  ): Promise<BookingAnalyticsItemDto[]> {
    const groups = await this.prisma.booking.groupBy({
      by: ["status"],
      where: { createdAt: { gte: start, lt: end } },
      _count: { _all: true },
    });

    const countByStatus = new Map(groups.map((group) => [group.status, group._count._all]));

    return Object.values(BookingStatus)
      .map((status) => ({
        key: status,
        label: status,
        count: countByStatus.get(status) ?? 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Destinations live in catalog_db: count bookings per offer here (booking_db), then ask catalog-service
  // which destination each offer belongs to (gRPC) and add the counts up. Needs catalog-service (503 otherwise).
  private async countByDestination(
    { start, end }: Period,
    limit: number,
  ): Promise<BookingAnalyticsItemDto[]> {
    const perOffer = await this.prisma.booking.groupBy({
      by: ["offerId"],
      where: { createdAt: { gte: start, lt: end } },
      _count: { _all: true },
    });

    const offers = await this.catalog.getOffersByIds(perOffer.map((group) => group.offerId));
    const byDestination = new Map<string, BookingAnalyticsItemDto>();

    for (const group of perOffer) {
      const offer = offers.get(group.offerId);
      const destination = offer
        ? { key: offer.destinationId, label: offer.destinationName }
        : UNKNOWN_DESTINATION; // hard-deleted offer
      const item = byDestination.get(destination.key) ?? { ...destination, count: 0 };

      item.count += group._count._all;
      byDestination.set(destination.key, item);
    }

    // same order as the stage II SQL: count desc, then name asc
    return [...byDestination.values()]
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, limit);
  }

  private toPeriod(from: string, to: string): Period {
    const start = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { BookingStatus } from "#prisma";
import { type BookingAnalyticsQueryDto } from "./schemas/booking-analytics-query.schema";
import {
  type BookingAnalyticsItemDto,
  type BookingAnalyticsResponseDto,
} from "./schemas/booking-analytics-response.schema";

type Period = { start: Date; end: Date };

type DestinationCountRow = { id: string; name: string; count: number };

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

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

  private async countByDestination(
    { start, end }: Period,
    limit: number,
  ): Promise<BookingAnalyticsItemDto[]> {
    const rows = await this.prisma.$queryRaw<DestinationCountRow[]>`
      SELECT d.id, d.name, COUNT(*)::int AS count
      FROM bookings b
      JOIN offers o ON o.id = b.offer_id
      JOIN destinations d ON d.id = o.destination_id
      WHERE b.created_at >= ${start} AND b.created_at < ${end}
      GROUP BY d.id, d.name
      ORDER BY count DESC, d.name ASC
      LIMIT ${limit}
    `;

    return rows.map((row) => ({
      key: row.id,
      label: row.name,
      count: row.count,
    }));
  }

  private toPeriod(from: string, to: string): Period {
    const start = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T00:00:00.000Z`);
    end.setUTCDate(end.getUTCDate() + 1);

    return { start, end };
  }
}

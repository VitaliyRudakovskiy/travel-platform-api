import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { providePrisma } from "@tests/providers/provide-prisma";
import { prismaServiceMock } from "@tests/mocks/prisma-service.mock";
import { AnalyticsService } from "./analytics.service";

describe("AnalyticsService", () => {
  let service: AnalyticsService;

  const from = "2026-11-01";
  const to = "2026-11-30";
  const periodStart = new Date("2026-11-01T00:00:00.000Z");
  const periodEnd = new Date("2026-12-01T00:00:00.000Z");

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, providePrisma()],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getBookingStats", () => {
    describe("groupBy status", () => {
      it("counts bookings per status within the inclusive period", async () => {
        prismaServiceMock.booking.groupBy.mockResolvedValue([
          { status: "confirmed", _count: { _all: 5 } },
          { status: "pending", _count: { _all: 2 } },
        ]);

        const result = await service.getBookingStats({ from, to, groupBy: "status", limit: 10 });

        expect(prismaServiceMock.booking.groupBy).toHaveBeenCalledWith({
          by: ["status"],
          where: { createdAt: { gte: periodStart, lt: periodEnd } },
          _count: { _all: true },
        });
        expect(result).toEqual({
          groupBy: "status",
          from,
          to,
          data: [
            { key: "confirmed", label: "confirmed", count: 5 },
            { key: "pending", label: "pending", count: 2 },
            { key: "completed", label: "completed", count: 0 },
            { key: "cancelled", label: "cancelled", count: 0 },
          ],
        });
      });

      it("returns all statuses with zero when there are no bookings", async () => {
        prismaServiceMock.booking.groupBy.mockResolvedValue([]);

        const result = await service.getBookingStats({ from, to, groupBy: "status", limit: 10 });

        expect(result.data.map((item) => item.count)).toEqual([0, 0, 0, 0]);
        expect(result.data).toHaveLength(4);
      });

      it("applies the limit to the sorted statuses", async () => {
        prismaServiceMock.booking.groupBy.mockResolvedValue([
          { status: "cancelled", _count: { _all: 7 } },
          { status: "pending", _count: { _all: 3 } },
        ]);

        const result = await service.getBookingStats({ from, to, groupBy: "status", limit: 1 });

        expect(result.data).toEqual([{ key: "cancelled", label: "cancelled", count: 7 }]);
      });
    });

    describe("groupBy destination", () => {
      it("maps destination counts returned by the raw query", async () => {
        const paris = { id: faker.string.uuid(), name: "Paris", count: 12 };
        const rome = { id: faker.string.uuid(), name: "Rome", count: 7 };
        prismaServiceMock.$queryRaw.mockResolvedValue([paris, rome]);

        const result = await service.getBookingStats({
          from,
          to,
          groupBy: "destination",
          limit: 5,
        });

        expect(prismaServiceMock.booking.groupBy).not.toHaveBeenCalled();
        expect(result).toEqual({
          groupBy: "destination",
          from,
          to,
          data: [
            { key: paris.id, label: "Paris", count: 12 },
            { key: rome.id, label: "Rome", count: 7 },
          ],
        });
      });

      it("passes the period and limit as query parameters", async () => {
        prismaServiceMock.$queryRaw.mockResolvedValue([]);

        await service.getBookingStats({ from, to, groupBy: "destination", limit: 5 });

        const [, ...parameters] = prismaServiceMock.$queryRaw.mock.calls[0];
        expect(parameters).toEqual([periodStart, periodEnd, 5]);
      });
    });

    it("includes the whole last day when from and to are the same date", async () => {
      prismaServiceMock.booking.groupBy.mockResolvedValue([]);

      await service.getBookingStats({ from, to: from, groupBy: "status", limit: 10 });

      expect(prismaServiceMock.booking.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            createdAt: { gte: periodStart, lt: new Date("2026-11-02T00:00:00.000Z") },
          },
        }),
      );
    });
  });
});

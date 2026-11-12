import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { providePrisma } from "../../../tests/providers/provide-prisma";
import { prismaServiceMock } from "../../../tests/mocks/prisma-service.mock";
import { catalogClientMock } from "../../../tests/mocks/catalog-client.mock";
import { provideCatalogClient } from "../../../tests/providers/provide-catalog-client";
import { AnalyticsService } from "./analytics.service";

// [offerId, OfferInfo] entry of the map returned by CatalogClient.getOffersByIds
const offer = (id: string, destinationId: string, destinationName: string) => [
  id,
  { id, destinationId, destinationName },
];

describe("AnalyticsService", () => {
  let service: AnalyticsService;

  const from = "2026-11-01";
  const to = "2026-11-30";
  const periodStart = new Date("2026-11-01T00:00:00.000Z");
  const periodEnd = new Date("2026-12-01T00:00:00.000Z");

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, providePrisma(), provideCatalogClient()],
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
      const paris = faker.string.uuid();
      const rome = faker.string.uuid();
      it("counts bookings per offer in booking_db and sums them per destination from catalog", async () => {
        prismaServiceMock.booking.groupBy.mockResolvedValue([
          { offerId: "o1", _count: { _all: 5 } },
          { offerId: "o2", _count: { _all: 7 } },
          { offerId: "o3", _count: { _all: 4 } },
        ]);
        catalogClientMock.getOffersByIds.mockResolvedValue(
          new Map([
            offer("o1", paris, "Paris"),
            offer("o2", rome, "Rome"),
            offer("o3", paris, "Paris"),
          ] as never),
        );

        const result = await service.getBookingStats({
          from,
          to,
          groupBy: "destination",
          limit: 5,
        });

        expect(prismaServiceMock.booking.groupBy).toHaveBeenCalledWith({
          by: ["offerId"],
          where: { createdAt: { gte: periodStart, lt: periodEnd } },
          _count: { _all: true },
        });
        expect(catalogClientMock.getOffersByIds).toHaveBeenCalledWith(["o1", "o2", "o3"]);
        expect(result.data).toEqual([
          { key: paris, label: "Paris", count: 9 },
          { key: rome, label: "Rome", count: 7 },
        ]);
      });

      it("sorts ties by name, applies the limit and groups unknown offers", async () => {
        prismaServiceMock.booking.groupBy.mockResolvedValue([
          { offerId: "o1", _count: { _all: 3 } },
          { offerId: "o2", _count: { _all: 3 } },
          { offerId: "gone", _count: { _all: 1 } },
        ]);
        catalogClientMock.getOffersByIds.mockResolvedValue(
          new Map([offer("o1", rome, "Rome"), offer("o2", paris, "Paris")] as never),
        );

        const all = await service.getBookingStats({ from, to, groupBy: "destination", limit: 10 });
        const top = await service.getBookingStats({ from, to, groupBy: "destination", limit: 1 });

        expect(all.data.map((item) => item.label)).toEqual([
          "Paris",
          "Rome",
          "Unknown destination",
        ]);
        expect(top.data).toEqual([{ key: paris, label: "Paris", count: 3 }]);
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

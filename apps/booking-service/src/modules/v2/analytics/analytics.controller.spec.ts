import { Test, TestingModule } from "@nestjs/testing";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { providePrisma } from "../../../tests/providers/provide-prisma";
import { provideAnalyticsService } from "../../../tests/providers/provide-analytics-service";
import { analyticsServiceMock } from "../../../tests/mocks/analytics-service.mock";
import { AnalyticsController } from "./analytics.controller";

describe("AnalyticsController v2", () => {
  let controller: AnalyticsController;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [provideAnalyticsService(), providePrisma()],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getBookingStats", () => {
    it("passes the query to the service and returns its result", async () => {
      const query = {
        from: "2026-11-01",
        to: "2026-11-30",
        groupBy: "status" as const,
        limit: 10,
      };
      const response = {
        ...query,
        data: [{ key: "confirmed", label: "confirmed", count: 3 }],
      };
      analyticsServiceMock.getBookingStats.mockResolvedValue(response);

      const result = await controller.getBookingStats(query);

      expect(analyticsServiceMock.getBookingStats).toHaveBeenCalledWith(query);
      expect(result).toEqual(response);
    });
  });
});

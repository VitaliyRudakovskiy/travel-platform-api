import { AnalyticsService } from "@modules/v2/analytics/analytics.service";
import { analyticsServiceMock } from "@tests/mocks/analytics-service.mock";

export const provideAnalyticsService = () => ({
  provide: AnalyticsService,
  useValue: analyticsServiceMock,
});

import { type INestApplication, VersioningType } from "@nestjs/common";
import { GlobalExceptionFilter } from "@shared/filters/global-exception.filter";

// Shared by main.ts and integration tests, so tests run the app exactly as in production
// (without URI versioning every /api/v2/... route would be a 404 in tests).
export function configureApp(app: INestApplication): void {
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "api/v",
    defaultVersion: "1",
  });
}

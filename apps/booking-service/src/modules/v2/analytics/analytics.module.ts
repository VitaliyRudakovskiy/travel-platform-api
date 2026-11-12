import { Module } from "@nestjs/common";
import { CatalogClientModule } from "../../catalog-client/catalog-client.module";
import { PrismaService } from "../../../prisma/prisma.service";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

@Module({
  imports: [CatalogClientModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService],
})
export class AnalyticsModule {}

import { Module } from "@nestjs/common";
import { AnalyticsModule } from "./analytics/analytics.module";
import { BookingsModule } from "./bookings/bookings.module";
import { FavoritesModule } from "./favorites/favorites.module";

@Module({
  imports: [AnalyticsModule, BookingsModule, FavoritesModule],
})
export class V2Module {}

import { Module } from "@nestjs/common";
import { AnalyticsModule } from "./analytics/analytics.module";
import { BookingsModule } from "./bookings/bookings.module";
import { DestinationsModule } from "./destinations/destinations.module";
import { EmailVerificationsModule } from "./email-verifications/email-verifications.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { OffersModule } from "./offers/offers.module";
import { SessionsModule } from "./sessions/sessions.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AnalyticsModule,
    BookingsModule,
    DestinationsModule,
    EmailVerificationsModule,
    FavoritesModule,
    NotificationsModule,
    OffersModule,
    SessionsModule,
    UsersModule,
  ],
})
export class V2Module {}

import { Module } from "@nestjs/common";
import { BookingsModule } from "./bookings/bookings.module";
import { DestinationsModule } from "./destinations/destinations.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { OffersModule } from "./offers/offers.module";
import { SessionsModule } from "./sessions/sessions.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    BookingsModule,
    DestinationsModule,
    FavoritesModule,
    OffersModule,
    SessionsModule,
    UsersModule,
  ],
  exports: [
    BookingsModule,
    DestinationsModule,
    FavoritesModule,
    OffersModule,
    SessionsModule,
    UsersModule,
  ],
})
export class V1Module {}

import { Module } from "@nestjs/common";
import { BookingsModule } from "./bookings/bookings.module";
import { FavoritesModule } from "./favorites/favorites.module";

@Module({
  imports: [BookingsModule, FavoritesModule],
  exports: [BookingsModule, FavoritesModule],
})
export class V1Module {}

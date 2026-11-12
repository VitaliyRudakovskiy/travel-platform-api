import { Module } from "@nestjs/common";
import { BookingsModule as V1BookingsModule } from "../../v1/bookings/bookings.module";
import { BookingsController } from "./bookings.controller";

@Module({
  imports: [V1BookingsModule],
  controllers: [BookingsController],
})
export class BookingsModule {}

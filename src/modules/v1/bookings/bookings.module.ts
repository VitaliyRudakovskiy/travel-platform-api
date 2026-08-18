import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { PrismaService } from "src/shared/services/prisma.service";
import { BookingsController } from "./bookings.controller";

@Module({
  providers: [BookingsService, PrismaService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}

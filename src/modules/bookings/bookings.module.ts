import { Module } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { PrismaService } from "@services/prisma.service";
import { BookingsController } from "./bookings.controller";

@Module({
  providers: [BookingsService, PrismaService],
  controllers: [BookingsController],
})
export class BookingsModule {}

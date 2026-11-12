import { Module } from "@nestjs/common";
import { BookingsModule as V1BookingsModule } from "@modules/v1/bookings/bookings.module";
import { PrismaService } from "@services/prisma.service";
import { BookingsController } from "./bookings.controller";

@Module({
  imports: [V1BookingsModule],
  controllers: [BookingsController],
  providers: [PrismaService],
})
export class BookingsModule {}

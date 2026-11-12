import { Module } from "@nestjs/common";
import { CatalogClientModule } from "../../catalog-client/catalog-client.module";
import { BookingsService } from "./bookings.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { BookingsController } from "./bookings.controller";

@Module({
  imports: [CatalogClientModule],
  providers: [BookingsService, PrismaService],
  controllers: [BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}

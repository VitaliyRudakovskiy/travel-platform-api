import { Module } from "@nestjs/common";
import { OffersService } from "./offers.service";
import { PrismaService } from "@shared/services/prisma.service";
import { OffersController } from "./offers.controller";

@Module({
  providers: [OffersService, PrismaService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}

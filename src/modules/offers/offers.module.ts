import { Module } from "@nestjs/common";
import { OffersService } from "./offers.service";
import { PrismaService } from "@services/prisma.service";
import { OffersController } from "./offers.controller";

@Module({
  providers: [OffersService, PrismaService],
  controllers: [OffersController],
})
export class OffersModule {}

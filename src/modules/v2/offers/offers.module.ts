import { Module } from "@nestjs/common";
import { OffersModule as V1OffersModule } from "@modules/v1/offers/offers.module";
import { PrismaService } from "@services/prisma.service";
import { OffersController } from "./offers.controller";

@Module({
  imports: [V1OffersModule],
  controllers: [OffersController],
  providers: [PrismaService],
})
export class OffersModule {}

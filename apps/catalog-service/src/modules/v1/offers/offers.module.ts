import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DestinationEntity } from "../destinations/entities/destination.entity";
import { OfferEntity } from "./entities/offer.entity";
import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity, DestinationEntity])],
  providers: [OffersService],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}

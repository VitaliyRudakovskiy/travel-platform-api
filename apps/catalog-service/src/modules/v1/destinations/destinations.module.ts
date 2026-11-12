import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfferEntity } from "../offers/entities/offer.entity";
import { DestinationsController } from "./destinations.controller";
import { DestinationsService } from "./destinations.service";
import { DestinationEntity } from "./entities/destination.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DestinationEntity, OfferEntity])],
  providers: [DestinationsService],
  controllers: [DestinationsController],
  exports: [DestinationsService],
})
export class DestinationsModule {}

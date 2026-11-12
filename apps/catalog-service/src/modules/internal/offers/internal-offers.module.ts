import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfferEntity } from "../../v1/offers/entities/offer.entity";
import { CatalogGrpcController } from "./catalog-grpc.controller";
import { InternalOffersController } from "./internal-offers.controller";
import { InternalOffersService } from "./internal-offers.service";

@Module({
  imports: [TypeOrmModule.forFeature([OfferEntity])],
  controllers: [InternalOffersController, CatalogGrpcController],
  providers: [InternalOffersService],
})
export class InternalOffersModule {}

import { Module } from "@nestjs/common";
import { OffersModule as V1OffersModule } from "../../v1/offers/offers.module";
import { OffersController } from "./offers.controller";

@Module({
  imports: [V1OffersModule],
  controllers: [OffersController],
})
export class OffersModule {}

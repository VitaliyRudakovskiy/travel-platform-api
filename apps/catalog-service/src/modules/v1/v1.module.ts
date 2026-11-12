import { Module } from "@nestjs/common";
import { DestinationsModule } from "./destinations/destinations.module";
import { OffersModule } from "./offers/offers.module";

@Module({
  imports: [DestinationsModule, OffersModule],
  exports: [DestinationsModule, OffersModule],
})
export class V1Module {}

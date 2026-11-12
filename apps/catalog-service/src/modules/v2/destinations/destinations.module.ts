import { Module } from "@nestjs/common";
import { DestinationsModule as V1DestinationsModule } from "../../v1/destinations/destinations.module";
import { DestinationsController } from "./destinations.controller";

@Module({
  imports: [V1DestinationsModule],
  controllers: [DestinationsController],
})
export class DestinationsModule {}

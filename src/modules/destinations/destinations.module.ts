import { Module } from "@nestjs/common";
import { DestinationsService } from "./destinations.service";
import { DestinationsController } from "./destinations.controller";
import { PrismaService } from "@services/prisma.service";

@Module({
  providers: [DestinationsService, PrismaService],
  controllers: [DestinationsController],
})
export class DestinationsModule {}

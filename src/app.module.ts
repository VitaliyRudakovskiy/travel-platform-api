import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "@modules/users/users.module";
import { SessionsModule } from "@modules/sessions/sessions.module";
import { DestinationsModule } from "@modules/destinations/destinations.module";
import { OffersModule } from "@modules/offers/offers.module";

@Module({
  imports: [UsersModule, SessionsModule, DestinationsModule, OffersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

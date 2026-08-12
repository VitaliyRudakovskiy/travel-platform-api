import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "@modules/users/users.module";
import { SessionsModule } from "@modules/sessions/sessions.module";
import { DestinationsModule } from "@modules/destinations/destinations.module";

@Module({
  imports: [UsersModule, SessionsModule, DestinationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NotificationsClient } from "./notifications-client.service";

export const INTERNAL_HTTP_TIMEOUT_MS = 5000;

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>("NOTIFICATION_SERVICE_URL") ?? "http://localhost:3004",
        timeout: INTERNAL_HTTP_TIMEOUT_MS,
      }),
    }),
  ],
  providers: [NotificationsClient],
  exports: [NotificationsClient],
})
export class NotificationsClientModule {}

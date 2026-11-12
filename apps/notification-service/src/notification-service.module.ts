import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { EventsModule } from "./modules/events/events.module";
import { NotificationsModule } from "./modules/v2/notifications/notifications.module";

@Module({
  imports: [
    // Only this service's env file; variables already set in the environment (Docker) take precedence.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "apps/notification-service/.env" }),
    // @Interval of the email worker
    ScheduleModule.forRoot(),
    NotificationsModule,
    EventsModule,
  ],
})
export class NotificationServiceModule {}

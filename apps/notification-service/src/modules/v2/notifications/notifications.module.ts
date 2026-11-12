import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AuthClientModule } from "../../auth-client/auth-client.module";
import { InternalNotificationsController } from "../../internal/notifications/internal-notifications.controller";
import { MailService } from "./mail.service";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { NotificationsWorker } from "./notifications.worker";

@Module({
  imports: [AuthClientModule],
  controllers: [NotificationsController, InternalNotificationsController],
  providers: [NotificationsService, NotificationsWorker, MailService, PrismaService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

import { Module } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { MailService } from "./mail.service";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { NotificationsWorker } from "./notifications.worker";

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsWorker, MailService, PrismaService],
})
export class NotificationsModule {}

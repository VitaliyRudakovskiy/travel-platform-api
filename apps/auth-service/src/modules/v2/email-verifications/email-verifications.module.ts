import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { NotificationsClientModule } from "../../notifications-client/notifications-client.module";
import { EmailVerificationsController } from "./email-verifications.controller";
import { EmailVerificationsService } from "./email-verifications.service";

@Module({
  imports: [NotificationsClientModule],
  controllers: [EmailVerificationsController],
  providers: [EmailVerificationsService, PrismaService],
  exports: [EmailVerificationsService],
})
export class EmailVerificationsModule {}

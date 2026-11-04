import { Module } from "@nestjs/common";
import { PrismaService } from "@services/prisma.service";
import { EmailVerificationsController } from "./email-verifications.controller";
import { EmailVerificationsService } from "./email-verifications.service";

@Module({
  controllers: [EmailVerificationsController],
  providers: [EmailVerificationsService, PrismaService],
  exports: [EmailVerificationsService],
})
export class EmailVerificationsModule {}

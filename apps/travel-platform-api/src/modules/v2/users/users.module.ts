import { Module } from "@nestjs/common";
import { UsersModule as V1UsersModule } from "@modules/v1/users/users.module";
import { PrismaService } from "@services/prisma.service";
import { EmailVerificationsModule } from "@modules/v2/email-verifications/email-verifications.module";
import { ClientProfilesService } from "./client-profiles.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [V1UsersModule, EmailVerificationsModule],
  controllers: [UsersController],
  providers: [ClientProfilesService, PrismaService],
})
export class UsersModule {}

import { Module } from "@nestjs/common";
import { UsersModule as V1UsersModule } from "../../v1/users/users.module";
import { PrismaService } from "../../../prisma/prisma.service";
import { EmailVerificationsModule } from "../email-verifications/email-verifications.module";
import { ClientProfilesService } from "./client-profiles.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [V1UsersModule, EmailVerificationsModule],
  controllers: [UsersController],
  providers: [ClientProfilesService, PrismaService],
})
export class UsersModule {}

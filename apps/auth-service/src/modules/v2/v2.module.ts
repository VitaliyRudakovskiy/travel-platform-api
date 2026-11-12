import { Module } from "@nestjs/common";
import { EmailVerificationsModule } from "./email-verifications/email-verifications.module";
import { SessionsModule } from "./sessions/sessions.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [EmailVerificationsModule, SessionsModule, UsersModule],
})
export class V2Module {}

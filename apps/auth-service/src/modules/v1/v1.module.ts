import { Module } from "@nestjs/common";
import { SessionsModule } from "./sessions/sessions.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [SessionsModule, UsersModule],
  exports: [SessionsModule, UsersModule],
})
export class V1Module {}

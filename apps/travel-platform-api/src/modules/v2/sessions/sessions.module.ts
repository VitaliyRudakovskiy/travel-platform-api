import { Module } from "@nestjs/common";
import { SessionsModule as V1SessionsModule } from "@modules/v1/sessions/sessions.module";
import { SessionsController } from "./sessions.controller";

@Module({
  imports: [V1SessionsModule],
  controllers: [SessionsController],
})
export class SessionsModule {}

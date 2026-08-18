import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { PrismaService } from "src/shared/services/prisma.service";
import { SessionsController } from "./sessions.controller";

@Module({
  providers: [SessionsService, PrismaService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}

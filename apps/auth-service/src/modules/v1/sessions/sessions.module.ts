import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./passport/local.strategy";
import { SessionsService } from "./sessions.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { SessionsController } from "./sessions.controller";

@Module({
  imports: [PassportModule],
  providers: [SessionsService, PrismaService, LocalStrategy],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}

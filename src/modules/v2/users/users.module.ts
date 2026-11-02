import { Module } from "@nestjs/common";
import { UsersModule as V1UsersModule } from "@modules/v1/users/users.module";
import { PrismaService } from "@services/prisma.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [V1UsersModule],
  controllers: [UsersController],
  providers: [PrismaService],
})
export class UsersModule {}

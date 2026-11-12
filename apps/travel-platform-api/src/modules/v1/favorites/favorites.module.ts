import { Module } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";
import { PrismaService } from "@services/prisma.service";
import { FavoritesController } from "./favorites.controller";

@Module({
  providers: [FavoritesService, PrismaService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}

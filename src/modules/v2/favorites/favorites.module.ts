import { Module } from "@nestjs/common";
import { FavoritesModule as V1FavoritesModule } from "@modules/v1/favorites/favorites.module";
import { PrismaService } from "@services/prisma.service";
import { FavoritesController } from "./favorites.controller";

@Module({
  imports: [V1FavoritesModule],
  controllers: [FavoritesController],
  providers: [PrismaService],
})
export class FavoritesModule {}

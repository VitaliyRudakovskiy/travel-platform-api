import { Module } from "@nestjs/common";
import { FavoritesModule as V1FavoritesModule } from "../../v1/favorites/favorites.module";
import { FavoritesController } from "./favorites.controller";

@Module({
  imports: [V1FavoritesModule],
  controllers: [FavoritesController],
})
export class FavoritesModule {}

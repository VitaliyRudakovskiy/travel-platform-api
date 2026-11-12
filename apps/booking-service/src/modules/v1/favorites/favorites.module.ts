import { Module } from "@nestjs/common";
import { CatalogClientModule } from "../../catalog-client/catalog-client.module";
import { FavoritesService } from "./favorites.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { FavoritesController } from "./favorites.controller";

@Module({
  imports: [CatalogClientModule],
  providers: [FavoritesService, PrismaService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}

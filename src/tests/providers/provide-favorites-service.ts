import { FavoritesService } from "@modules/v1/favorites/favorites.service";
import { favoritesServiceMock } from "@tests/mocks/favorites-service.mock";

export const provideFavoritesService = () => ({
  provide: FavoritesService,
  useValue: favoritesServiceMock,
});

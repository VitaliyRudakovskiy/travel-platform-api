import { vi } from "vitest";

export const favoritesServiceMock = {
  getAll: vi.fn(),
  addToFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
  isFavorite: vi.fn(),
};

import { vi } from "vitest";

export const offersServiceMock = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  hardDelete: vi.fn(),
};

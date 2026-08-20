import { vi } from "vitest";

export const usersServiceMock = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
};

import { vi } from "vitest";
import { DEFAULT_CRUD } from "./default-crud.mock";

export const prismaServiceMock = {
  user: DEFAULT_CRUD,
  booking: {
    ...DEFAULT_CRUD,
    count: vi.fn(),
  },
  offer: {
    ...DEFAULT_CRUD,
    count: vi.fn(),
  },
  destination: {
    ...DEFAULT_CRUD,
    count: vi.fn(),
  },
  favorite: {
    ...DEFAULT_CRUD,
    count: vi.fn(),
  },
};

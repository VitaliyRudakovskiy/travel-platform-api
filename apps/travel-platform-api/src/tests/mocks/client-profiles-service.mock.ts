import { vi } from "vitest";

export const clientProfilesServiceMock = {
  getByUserId: vi.fn(),
  update: vi.fn(),
};

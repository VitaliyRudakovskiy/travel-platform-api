import { vi } from "vitest";

export const emailVerificationsServiceMock = {
  issue: vi.fn(),
  confirm: vi.fn(),
};

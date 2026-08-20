import { vi } from "vitest";

export const bookingsServiceMock = {
  getMyBookings: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  updateStatus: vi.fn(),
};

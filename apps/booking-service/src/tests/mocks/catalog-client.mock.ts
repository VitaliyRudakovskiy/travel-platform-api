import { vi } from "vitest";

export const catalogClientMock = {
  getOffer: vi.fn(),
  getOffersByIds: vi.fn(),
  checkAvailability: vi.fn(),
  reserve: vi.fn(),
  release: vi.fn(),
};

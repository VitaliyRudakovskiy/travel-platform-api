import { vi } from "vitest";
import { DEFAULT_CRUD } from "./default-crud.mock";

// booking_db only: bookings, favorites, idempotency keys, outbox events
export const prismaServiceMock = {
  booking: {
    ...DEFAULT_CRUD,
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  favorite: {
    ...DEFAULT_CRUD,
    count: vi.fn(),
  },
  idempotencyKey: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  outboxEvent: {
    findMany: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  $transaction: vi.fn(),
};

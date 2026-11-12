import { vi } from "vitest";

// notify_db only: notifications
export const prismaServiceMock = {
  notification: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
};

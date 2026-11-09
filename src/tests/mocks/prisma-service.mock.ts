import { vi } from "vitest";
import { DEFAULT_CRUD } from "./default-crud.mock";

export const prismaServiceMock = {
  user: DEFAULT_CRUD,
  userSession: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  clientProfile: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
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
  emailVerification: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  },
  notification: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
  $transaction: vi.fn(),
};

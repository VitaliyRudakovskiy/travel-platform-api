import { vi } from "vitest";

// Mock of a TypeORM Repository: only the methods catalog-service uses.
export function createRepositoryMock() {
  return {
    find: vi.fn(),
    findAndCount: vi.fn(),
    findOne: vi.fn(),
    findOneBy: vi.fn(),
    existsBy: vi.fn(),
    count: vi.fn(),
    // create() and merge() are pure in TypeORM: build the entity object, no DB access
    create: vi.fn((entity: object) => ({ ...entity })),
    merge: vi.fn((entity: object, ...patches: object[]) => Object.assign(entity, ...patches)),
    save: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    createQueryBuilder: vi.fn(),
  };
}

export type RepositoryMock = ReturnType<typeof createRepositoryMock>;

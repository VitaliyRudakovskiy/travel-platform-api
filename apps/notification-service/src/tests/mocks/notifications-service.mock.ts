import { vi } from "vitest";

export const notificationsServiceMock = {
  findAll: vi.fn(),
  sendPendingEmails: vi.fn(),
};

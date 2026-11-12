import { faker } from "@faker-js/faker";

const bookingId = faker.string.uuid();

export const notificationMock = {
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  bookingId,
  type: "booking_confirmed" as const,
  channel: "in_app" as const,
  status: "sent" as const,
  payload: { bookingId },
  errorMessage: null,
  createdAt: faker.date.past(),
  sentAt: faker.date.past(),
};

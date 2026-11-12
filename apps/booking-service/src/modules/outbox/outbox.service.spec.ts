import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { describe, beforeEach, it, expect, vi } from "vitest";
import { providePrisma } from "../../tests/providers/provide-prisma";
import { prismaServiceMock } from "../../tests/mocks/prisma-service.mock";
import { OUTBOX_BATCH_SIZE, OUTBOX_MAX_ATTEMPTS } from "./outbox.constants";
import { OutboxService } from "./outbox.service";

function outboxEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: faker.string.uuid(),
    eventType: "booking_created",
    payload: { type: "booking.created", bookingId: faker.string.uuid() },
    status: "pending",
    attempts: 0,
    createdAt: new Date("2026-11-12T10:00:00.000Z"),
    publishedAt: null,
    ...overrides,
  };
}

describe("OutboxService", () => {
  let service: OutboxService;
  const amqp = { connected: true, publish: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    amqp.connected = true;

    const module: TestingModule = await Test.createTestingModule({
      providers: [OutboxService, providePrisma(), { provide: AmqpConnection, useValue: amqp }],
    }).compile();

    service = module.get(OutboxService);
  });

  it("does nothing and spends no attempts while RabbitMQ is unreachable", async () => {
    amqp.connected = false;

    await expect(service.publishPendingEvents()).resolves.toEqual({
      published: 0,
      failed: 0,
      skipped: true,
    });
    expect(prismaServiceMock.outboxEvent.findMany).not.toHaveBeenCalled();
  });

  it("reads pending events oldest first, in batches", async () => {
    prismaServiceMock.outboxEvent.findMany.mockResolvedValue([]);

    await service.publishPendingEvents();

    expect(prismaServiceMock.outboxEvent.findMany).toHaveBeenCalledWith({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      take: OUTBOX_BATCH_SIZE,
    });
  });

  it("publishes to travel.events with the event name as routing key and eventId as messageId", async () => {
    const created = outboxEvent();
    const changed = outboxEvent({ eventType: "booking_status_changed" });
    prismaServiceMock.outboxEvent.findMany.mockResolvedValue([created, changed]);
    amqp.publish.mockResolvedValue(true);

    const result = await service.publishPendingEvents();

    expect(amqp.publish).toHaveBeenNthCalledWith(
      1,
      "travel.events",
      "booking.created",
      created.payload,
      expect.objectContaining({ messageId: created.id, persistent: true }),
    );
    expect(amqp.publish).toHaveBeenNthCalledWith(
      2,
      "travel.events",
      "booking.status_changed",
      changed.payload,
      expect.objectContaining({ messageId: changed.id }),
    );
    expect(result).toEqual({ published: 2, failed: 0, skipped: false });
  });

  it("marks an event published only after the broker confirmed it", async () => {
    const event = outboxEvent();
    prismaServiceMock.outboxEvent.findMany.mockResolvedValue([event]);
    amqp.publish.mockResolvedValue(true);

    await service.publishPendingEvents();

    expect(prismaServiceMock.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: event.id },
      data: { status: "published", publishedAt: expect.any(Date) },
    });
    expect(amqp.publish.mock.invocationCallOrder[0]).toBeLessThan(
      prismaServiceMock.outboxEvent.update.mock.invocationCallOrder[0],
    );
  });

  it("increments attempts and keeps the event pending when publishing fails", async () => {
    const event = outboxEvent({ attempts: 1 });
    prismaServiceMock.outboxEvent.findMany.mockResolvedValue([event]);
    amqp.publish.mockRejectedValue(new Error("timeout"));

    const result = await service.publishPendingEvents();

    expect(prismaServiceMock.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: event.id },
      data: { attempts: 2 },
    });
    expect(result).toEqual({ published: 0, failed: 1, skipped: false });
  });

  it("marks the event failed after the last allowed attempt", async () => {
    const event = outboxEvent({ attempts: OUTBOX_MAX_ATTEMPTS - 1 });
    prismaServiceMock.outboxEvent.findMany.mockResolvedValue([event]);
    amqp.publish.mockRejectedValue(new Error("timeout"));

    await service.publishPendingEvents();

    expect(prismaServiceMock.outboxEvent.update).toHaveBeenCalledWith({
      where: { id: event.id },
      data: { attempts: OUTBOX_MAX_ATTEMPTS, status: "failed" },
    });
  });

  it("one failed event does not stop the rest of the batch", async () => {
    const broken = outboxEvent();
    const fine = outboxEvent();
    prismaServiceMock.outboxEvent.findMany.mockResolvedValue([broken, fine]);
    amqp.publish.mockRejectedValueOnce(new Error("timeout")).mockResolvedValueOnce(true);

    await expect(service.publishPendingEvents()).resolves.toEqual({
      published: 1,
      failed: 1,
      skipped: false,
    });
  });
});

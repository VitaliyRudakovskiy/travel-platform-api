import { ConflictException } from "@nestjs/common";
import { describe, it, expect } from "vitest";
import { BookingStatus } from "#booking-prisma";
import { createBookingState } from "./booking-state";

// Allowed transitions from the spec (Stage II, 2.4). Written out independently of the
// implementation on purpose: the test must not derive its expectations from the code under test.
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: [BookingStatus.confirmed, BookingStatus.cancelled],
  confirmed: [BookingStatus.completed, BookingStatus.cancelled],
  completed: [BookingStatus.cancelled],
  cancelled: [],
};

const ALL_STATUSES = Object.values(BookingStatus);

const transitions = ALL_STATUSES.flatMap((from) =>
  ALL_STATUSES.map((to) => ({ from, to, allowed: ALLOWED_TRANSITIONS[from].includes(to) })),
);

describe("createBookingState", () => {
  it("covers every status pair (4 x 4)", () => {
    expect(transitions).toHaveLength(16);
  });

  describe("allowed transitions", () => {
    it.each(transitions.filter(({ allowed }) => allowed))(
      "$from -> $to returns the target status",
      ({ from, to }) => {
        expect(createBookingState(from).transitionTo(to)).toBe(to);
      },
    );
  });

  describe("illegal transitions", () => {
    it.each(transitions.filter(({ allowed }) => !allowed))(
      "$from -> $to throws ConflictException",
      ({ from, to }) => {
        const transition = () => createBookingState(from).transitionTo(to);

        expect(transition).toThrow(ConflictException);
        expect(transition).toThrow(`Cannot transition booking from ${from} to ${to}`);
      },
    );
  });
});

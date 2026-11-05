import { ConflictException } from "@nestjs/common";
import { describe, it, expect } from "vitest";
import { BookingStatus } from "#prisma";
import { createBookingState } from "./booking-state";

describe("createBookingState", () => {
  describe("pending", () => {
    const state = createBookingState(BookingStatus.pending);

    it("allows confirmed", () => {
      expect(state.transitionTo(BookingStatus.confirmed)).toBe(BookingStatus.confirmed);
    });

    it("allows cancelled", () => {
      expect(state.transitionTo(BookingStatus.cancelled)).toBe(BookingStatus.cancelled);
    });

    it("rejects completed", () => {
      expect(() => state.transitionTo(BookingStatus.completed)).toThrow(ConflictException);
    });
  });

  describe("confirmed", () => {
    const state = createBookingState(BookingStatus.confirmed);

    it("allows completed", () => {
      expect(state.transitionTo(BookingStatus.completed)).toBe(BookingStatus.completed);
    });

    it("allows cancelled", () => {
      expect(state.transitionTo(BookingStatus.cancelled)).toBe(BookingStatus.cancelled);
    });

    it("rejects pending", () => {
      expect(() => state.transitionTo(BookingStatus.pending)).toThrow(ConflictException);
    });
  });

  describe("completed", () => {
    const state = createBookingState(BookingStatus.completed);

    it("allows cancelled", () => {
      expect(state.transitionTo(BookingStatus.cancelled)).toBe(BookingStatus.cancelled);
    });

    it("rejects confirmed", () => {
      expect(() => state.transitionTo(BookingStatus.confirmed)).toThrow(ConflictException);
    });
  });

  describe("cancelled", () => {
    const state = createBookingState(BookingStatus.cancelled);

    it("rejects confirmed", () => {
      expect(() => state.transitionTo(BookingStatus.confirmed)).toThrow(ConflictException);
    });

    it("rejects cancelled", () => {
      expect(() => state.transitionTo(BookingStatus.cancelled)).toThrow(ConflictException);
    });
  });
});

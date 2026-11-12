import { describe, expect, it } from "vitest";
import { BookingStatus } from "#prisma";
import { fromV1BookingStatus, toV1BookingStatus } from "./v1-booking-status";

describe("v1 booking status mapping", () => {
  describe("toV1BookingStatus", () => {
    it("keeps pending, confirmed and cancelled", () => {
      expect(toV1BookingStatus(BookingStatus.pending)).toBe("pending");
      expect(toV1BookingStatus(BookingStatus.confirmed)).toBe("confirmed");
      expect(toV1BookingStatus(BookingStatus.cancelled)).toBe("cancelled");
    });

    it("maps completed to confirmed for the v1 contract", () => {
      expect(toV1BookingStatus(BookingStatus.completed)).toBe("confirmed");
    });
  });

  describe("fromV1BookingStatus", () => {
    it("passes pending, confirmed and cancelled through", () => {
      expect(fromV1BookingStatus("pending")).toBe(BookingStatus.pending);
      expect(fromV1BookingStatus("confirmed")).toBe(BookingStatus.confirmed);
      expect(fromV1BookingStatus("cancelled")).toBe(BookingStatus.cancelled);
    });
  });
});

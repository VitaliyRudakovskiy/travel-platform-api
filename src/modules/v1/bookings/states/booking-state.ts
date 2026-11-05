import { ConflictException } from "@nestjs/common";
import { BookingStatus } from "#prisma";

export interface BookingState {
  transitionTo(target: BookingStatus): BookingStatus;
}

class PendingBookingState implements BookingState {
  transitionTo(target: BookingStatus): BookingStatus {
    if (target === BookingStatus.confirmed || target === BookingStatus.cancelled) {
      return target;
    }

    throw illegalTransition(BookingStatus.pending, target);
  }
}

class ConfirmedBookingState implements BookingState {
  transitionTo(target: BookingStatus): BookingStatus {
    if (target === BookingStatus.completed || target === BookingStatus.cancelled) {
      return target;
    }

    throw illegalTransition(BookingStatus.confirmed, target);
  }
}

class CompletedBookingState implements BookingState {
  transitionTo(target: BookingStatus): BookingStatus {
    if (target === BookingStatus.cancelled) {
      return target;
    }

    throw illegalTransition(BookingStatus.completed, target);
  }
}

class CancelledBookingState implements BookingState {
  transitionTo(target: BookingStatus): BookingStatus {
    throw illegalTransition(BookingStatus.cancelled, target);
  }
}

export function createBookingState(status: BookingStatus): BookingState {
  switch (status) {
    case BookingStatus.pending:
      return new PendingBookingState();
    case BookingStatus.confirmed:
      return new ConfirmedBookingState();
    case BookingStatus.completed:
      return new CompletedBookingState();
    case BookingStatus.cancelled:
      return new CancelledBookingState();
  }
}

function illegalTransition(from: BookingStatus, to: BookingStatus): ConflictException {
  return new ConflictException(`Cannot transition booking from ${from} to ${to}`);
}

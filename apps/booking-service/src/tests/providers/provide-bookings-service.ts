import { BookingsService } from "../../modules/v1/bookings/bookings.service";
import { bookingsServiceMock } from "../mocks/bookings-service.mock";

export const provideBookingsService = () => ({
  provide: BookingsService,
  useValue: bookingsServiceMock,
});

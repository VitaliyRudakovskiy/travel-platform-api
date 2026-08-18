import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Version,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { AuthGuard } from "src/shared/guards/auth.guard";
import { type CreateBookingDto, createBookingSchema } from "./schemas/create-booking.schema";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { BookingResponseDto } from "./schemas/booking-response.schema";
import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import { type PaginatedBookingResponseDto } from "./schemas/paginated-booking-response.schema";
import { type BookingQueryDto, bookingQuerySchema } from "./schemas/booking-query.schema";
import {
  updateBookingStatusSchema,
  type UpdateBookingStatusDto,
} from "./schemas/update-booking.schema";

@Controller("bookings")
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Version("1")
  async getMyBookings(
    @Query(new ZodValidationPipe(bookingQuerySchema))
    query: BookingQueryDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingsService.getMyBookings(query, currentUser.id);
  }

  @Get(":bookingId")
  @Version("1")
  async getById(
    @Param("bookingId") bookingId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.getById(bookingId, currentUser.id);
  }

  @Post()
  @Version("1")
  async create(
    @Body(new ZodValidationPipe(createBookingSchema))
    createBookingDto: CreateBookingDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.create(createBookingDto, currentUser.id);
  }

  @Patch("status/:bookingId")
  @Version("1")
  async updateStatus(
    @Param("bookingId") bookingId: string,
    @Body(new ZodValidationPipe(updateBookingStatusSchema))
    updateStatusDto: UpdateBookingStatusDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.updateStatus(bookingId, updateStatusDto, currentUser.id);
  }
}

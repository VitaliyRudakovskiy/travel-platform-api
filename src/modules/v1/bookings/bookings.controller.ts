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
import { AuthGuard } from "@shared/guards/auth.guard";
import { type CreateBookingDto, createBookingSchema } from "./schemas/create-booking.schema";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { BookingResponseDto } from "./schemas/booking-response.schema";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { type PaginatedBookingResponseDto } from "./schemas/paginated-booking-response.schema";
import { type BookingQueryDto, bookingQuerySchema } from "./schemas/booking-query.schema";
import {
  updateBookingStatusSchema,
  type UpdateBookingStatusDto,
} from "./schemas/update-booking.schema";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaginatedBookingResponse } from "./schemas/swagger/paginated-booking-response";
import { BookingResponse } from "./schemas/swagger/booking-response";
import { CreateBooking } from "./schemas/swagger/create-booking";
import { UpdateBooking } from "./schemas/swagger/update-booking";

@ApiTags("Bookings")
@Controller("bookings")
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Version("1")
  @ApiOperation({
    summary: "Get current user's bookings",
    description: "Returns a paginated list of bookings for the authenticated user",
  })
  @ApiResponse({
    status: 200,
    description: "List of bookings retrieved successfully",
    type: PaginatedBookingResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid query parameters",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  async getMyBookings(
    @Query(new ZodValidationPipe(bookingQuerySchema))
    query: BookingQueryDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingsService.getMyBookings(query, currentUser.id);
  }

  @Get(":bookingId")
  @Version("1")
  @ApiOperation({
    summary: "Get a booking by ID",
    description: "Returns detailed information about a specific booking",
  })
  @ApiParam({
    name: "bookingId",
    description: "Booking UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiResponse({
    status: 200,
    description: "Booking found",
    type: BookingResponse,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - You can only access your own bookings",
  })
  @ApiResponse({
    status: 404,
    description: "Booking not found",
  })
  async getById(
    @Param("bookingId") bookingId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.getById(bookingId, currentUser.id);
  }

  @Post()
  @Version("1")
  @ApiOperation({
    summary: "Create a new booking",
    description: `
        Creates a new booking for an offer.

        **Validation rules:**
        - End date must be after start date
        - Dates must be within offer availability period
        - Guests count must not exceed offer's maxGuests
        - Must not exceed offer's maxConcurrentBookings

        **Status:** New bookings are created with status "draft"
      `,
  })
  @ApiBody({ type: CreateBooking })
  @ApiResponse({
    status: 201,
    description: "Booking created successfully",
    type: BookingResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input data, dates outside availability, or guests count exceeds limit",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 404,
    description: "Offer not found or not active",
  })
  @ApiResponse({
    status: 409,
    description: "No available slots for these dates (max concurrent bookings reached)",
  })
  async create(
    @Body(new ZodValidationPipe(createBookingSchema))
    createBookingDto: CreateBookingDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.create(createBookingDto, currentUser.id);
  }

  @Patch("status/:bookingId")
  @Version("1")
  @ApiOperation({
    summary: "Update booking status",
    description: `
       Updates the status of a booking.

       **Status transition rules:**
       - "draft" → "confirmed" (confirm a draft booking)
       - "draft" → "cancelled" (cancel a draft booking)
       - "confirmed" → "cancelled" (cancel a confirmed booking)

       **Cannot:**
       - Confirm a booking that is already confirmed
       - Cancel a booking that is already cancelled
       - Confirm a booking if offer is no longer active
       - Confirm a booking if dates are outside offer availability
       - Confirm a booking if max concurrent bookings reached
     `,
  })
  @ApiParam({
    name: "bookingId",
    description: "Booking UUID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @ApiBody({ type: UpdateBooking })
  @ApiResponse({
    status: 200,
    description: "Booking status updated successfully",
    type: BookingResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid status transition or input data",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Authentication required",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - You can only update your own bookings",
  })
  @ApiResponse({
    status: 404,
    description: "Booking not found",
  })
  @ApiResponse({
    status: 409,
    description:
      "Cannot confirm booking - offer no longer active, dates outside availability, or max concurrent bookings reached",
  })
  async updateStatus(
    @Param("bookingId") bookingId: string,
    @Body(new ZodValidationPipe(updateBookingStatusSchema))
    updateStatusDto: UpdateBookingStatusDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.updateStatus(bookingId, updateStatusDto, currentUser.id);
  }
}

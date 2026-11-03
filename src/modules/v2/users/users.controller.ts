import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { UsersService } from "@modules/v1/users/users.service";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { type CreateUserDto, createUserSchema } from "@modules/v1/users/schemas/create-user.schema";
import { JwtAuthGuard } from "@shared/guards/jwt-auth.guard";
import { CurrentUser } from "@shared/decorators/current-user.decorator";
import { type UserResponseDto } from "@modules/v1/users/schemas/user-response.schema";
import { type UpdateUserDto, updateUserSchema } from "@modules/v1/users/schemas/update-user.schema";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserResponse } from "@modules/v1/users/schemas/swagger/user-response";
import { UpdateUser } from "@modules/v1/users/schemas/swagger/update-user";
import { CreateUser } from "@modules/v1/users/schemas/swagger/create-user";

@ApiTags("Users")
@Controller({ path: "users", version: "2" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all users",
    description: "Returns a list of all registered users",
  })
  @ApiResponse({
    status: 200,
    description: "List of users",
    type: [UserResponse],
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async get(): Promise<UserResponseDto[]> {
    return this.usersService.getAll();
  }

  @Get(":userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user by ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({
    status: 200,
    description: "User found",
    type: UserResponse,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getOne(
    @Param("userId") userId: string,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<UserResponseDto> {
    if (userId !== currentUser.id) {
      throw new ForbiddenException("You can only access your own profile");
    }

    return this.usersService.getById(userId);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @ApiOperation({ summary: "Create a new user" })
  @ApiBody({ type: CreateUser })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponse,
  })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.createWithProfile(createUserDto);
  }

  @Patch(":userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBody({ type: UpdateUser })
  @ApiResponse({
    status: 200,
    description: "User updated",
    type: UserResponse,
  })
  @ApiResponse({ status: 403, description: "Forbidden" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiResponse({ status: 409, description: "Email is already taken" })
  async update(
    @Param("userId") userId: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserResponseDto,
  ): Promise<UserResponseDto> {
    if (userId !== currentUser.id) {
      throw new ForbiddenException("You can only update your own profile");
    }

    return this.usersService.update(userId, updateUserDto);
  }
}

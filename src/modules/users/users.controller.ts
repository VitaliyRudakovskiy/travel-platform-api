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
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "@pipes/zod-validation.pipe";
import { type CreateUserDto, createUserSchema } from "./schemas/create-user.schema.js";
import { AuthGuard } from "src/guards/auth.guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { type UserResponseDto } from "./schemas/user-response.schema";
import { type UpdateUserDto, updateUserSchema } from "./schemas/update-user.schema";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get() {
    return this.usersService.getAll();
  }

  @Get(":userId")
  @UseGuards(AuthGuard)
  async getOne(@Param("userId") userId: string, @CurrentUser() currentUser: UserResponseDto) {
    if (userId !== currentUser.id) {
      throw new ForbiddenException("You can only access your own profile");
    }

    return this.usersService.getById(userId);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(":userId")
  @UseGuards(AuthGuard)
  async update(
    @Param("userId") userId: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: UserResponseDto,
  ) {
    if (userId !== currentUser.id) {
      throw new ForbiddenException("You can only update your own profile");
    }

    return this.usersService.update(userId, updateUserDto);
  }
}

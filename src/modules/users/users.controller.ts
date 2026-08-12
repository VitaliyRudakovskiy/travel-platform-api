import { Body, Controller, Get, Post, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "@pipes/zod-validation.pipe";
import { type CreateUserDto, createUserSchema } from "./schemas/create-user.schema.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async get() {
    return this.usersService.getAll();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

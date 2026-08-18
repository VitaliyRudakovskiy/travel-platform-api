import { type LoginDto, loginSchema } from "@modules/v1/users/schemas/login.schema";
import { Body, Controller, Post, UsePipes, Version } from "@nestjs/common";
import { ZodValidationPipe } from "src/shared/pipes/zod-validation.pipe";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @Version("1")
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    return this.sessionsService.login(loginDto);
  }
}

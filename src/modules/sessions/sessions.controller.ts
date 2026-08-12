import { type LoginDto, loginSchema } from "@modules/users/schemas/login.schema";
import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "@pipes/zod-validation.pipe";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() loginDto: LoginDto) {
    return this.sessionsService.login(loginDto);
  }
}

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { type User } from "#auth-prisma";
import { Strategy } from "passport-local";
import { SessionsService } from "../sessions.service";

// passport-local reads `email` + `password` from the body and calls validate();
// the returned user is attached to `request.user`. Invalid credentials -> UnauthorizedException from the service.
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly sessionsService: SessionsService) {
    super({ usernameField: "email", passwordField: "password" });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.sessionsService.validateCredentials({ email, password });
  }
}

import { type ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "@app/common";
import { loginSchema } from "../../users/schemas/login.schema";

/**
 * Guards run before pipes. A plain AuthGuard("local") would answer 401 to a malformed body
 * (missing password, invalid email), while the stage I/II contract answers 400 with validation details.
 * So the body is validated with the same Zod schema first, then passport-local authenticates.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  private readonly validationPipe = new ZodValidationPipe(loginSchema);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ body: unknown }>();
    request.body = this.validationPipe.transform(request.body);

    return (await super.canActivate(context)) as boolean;
  }
}

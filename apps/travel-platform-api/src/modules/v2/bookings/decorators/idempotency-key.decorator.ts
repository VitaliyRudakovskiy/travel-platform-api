import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ZodValidationPipe } from "@shared/pipes/zod-validation.pipe";
import { idempotencyKeySchema } from "../schemas/idempotency-key.schema";

const extractIdempotencyKey = createParamDecorator(
  (_data: unknown, context: ExecutionContext): unknown => {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    return request.headers["idempotency-key"];
  },
);

export const IdempotencyKey = () =>
  extractIdempotencyKey(undefined, new ZodValidationPipe(idempotencyKeySchema));

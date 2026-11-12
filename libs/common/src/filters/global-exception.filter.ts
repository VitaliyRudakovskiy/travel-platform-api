import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

const STATUS_TEXT: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  429: "Too Many Requests",
  500: "Internal Server Error",
  503: "Service Unavailable",
};

interface ExceptionBody {
  message?: string | string[];
  // usually a string; @nestjs/terminus puts the failed checks here as an object
  error?: unknown;
  errors?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    let message: string | string[] = "Internal server error";
    let error: string | undefined;
    let details: unknown = null;

    if (exception instanceof HttpException) {
      const body = exception.getResponse() as string | ExceptionBody;
      if (typeof body === "string") {
        message = body;
      } else {
        message = body.message ?? exception.message;
        if (typeof body.error === "string") {
          error = body.error;
          details = body.errors ?? null;
        } else {
          // e.g. a failed health check: { status, info, error, details } goes to `details`,
          // `error` stays the status text so the format is the same for every response
          details = body.errors ?? (body.error ? body : null);
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      error: error ?? STATUS_TEXT[status] ?? "Error",
      message,
      details,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

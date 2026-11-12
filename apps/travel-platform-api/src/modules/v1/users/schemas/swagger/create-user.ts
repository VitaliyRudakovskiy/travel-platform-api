import { ApiProperty } from "@nestjs/swagger";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../models/schema.constants";

export class CreateUser {
  @ApiProperty({
    example: "john_doe_updated",
    description: "User name",
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
    pattern: "^[a-zA-Z0-9_]+$",
    required: true,
  })
  username: string;

  @ApiProperty({
    example: "john.updated@example.com",
    description: "Email address",
    minLength: EMAIL_MIN_LENGTH,
    maxLength: EMAIL_MAX_LENGTH,
    format: "email",
    required: true,
  })
  email: string;

  @ApiProperty({
    example: "12345678",
    description: "User password",
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: PASSWORD_MAX_LENGTH,
    format: "password",
    required: true,
  })
  password: string;
}

import { ApiProperty } from "@nestjs/swagger";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../models/schema.constants";

export class UpdateUser {
  @ApiProperty({
    example: "john_doe_updated",
    description: "Updated username",
    minLength: USERNAME_MIN_LENGTH,
    maxLength: USERNAME_MAX_LENGTH,
    pattern: "^[a-zA-Z0-9_]+$",
    required: false,
  })
  username?: string;

  @ApiProperty({
    example: "john.updated@example.com",
    description: "Updated email address",
    minLength: EMAIL_MIN_LENGTH,
    maxLength: EMAIL_MAX_LENGTH,
    format: "email",
    required: false,
  })
  email?: string;
}

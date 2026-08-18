import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@modules/v1/users/models/schema.constants";
import { ApiProperty } from "@nestjs/swagger";

export class LoginClass {
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

import { ApiProperty } from "@nestjs/swagger";

export class ConfirmEmail {
  @ApiProperty({
    example: "7f3c1d2e9a0b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d",
    description: "Plain verification token from the email notification payload",
  })
  token: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "#auth-prisma";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
} from "../../models/profile.constants";

export class UpdateProfile {
  @ApiProperty({
    example: "John",
    description: "First name",
    maxLength: FIRST_NAME_MAX_LENGTH,
    nullable: true,
    required: false,
  })
  firstName?: string | null;

  @ApiProperty({
    example: "Doe",
    description: "Last name",
    maxLength: LAST_NAME_MAX_LENGTH,
    nullable: true,
    required: false,
  })
  lastName?: string | null;

  @ApiProperty({
    example: "+375291234567",
    description: "Phone number",
    maxLength: PHONE_MAX_LENGTH,
    nullable: true,
    required: false,
  })
  phone?: string | null;

  @ApiProperty({
    example: Currency.USD,
    description: "Preferred currency",
    enum: [Currency.BYN, Currency.USD, Currency.EUR],
    required: false,
  })
  preferredCurrency?: Currency;
}

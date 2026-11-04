import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "#prisma";

export class ProfileResponse {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Profile UUID",
  })
  id: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "User UUID",
  })
  userId: string;

  @ApiProperty({
    example: "John",
    description: "First name",
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    example: "Doe",
    description: "Last name",
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    example: "+375291234567",
    description: "Phone number",
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    example: Currency.BYN,
    description: "Preferred currency",
    enum: [Currency.BYN, Currency.USD, Currency.EUR],
  })
  preferredCurrency: Currency;

  @ApiProperty({
    example: "2026-12-22T00:00:00.000Z",
    description: "Creation timestamp",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2026-11-21T00:00:00.000Z",
    description: "Last update timestamp",
  })
  updatedAt: Date;
}

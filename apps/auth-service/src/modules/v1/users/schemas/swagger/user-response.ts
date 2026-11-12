import { ApiProperty } from "@nestjs/swagger";

export class UserResponse {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "User UUID",
  })
  id: string;

  @ApiProperty({
    example: "john_doe",
    description: "Username",
  })
  username: string;

  @ApiProperty({
    example: "john@example.com",
    description: "User email",
  })
  email: string;

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

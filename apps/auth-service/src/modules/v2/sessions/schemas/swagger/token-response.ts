import { ApiProperty } from "@nestjs/swagger";

export class TokenResponse {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT access token",
  })
  accessToken: string;

  @ApiProperty({
    example: "7f3c1d2e9a0b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d",
    description: "Refresh token. Store it and send it to refresh or logout.",
  })
  refreshToken: string;
}

export class AccessTokenResponse {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT access token",
  })
  accessToken: string;
}

export class RefreshTokenBody {
  @ApiProperty({
    example: "7f3c1d2e9a0b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d",
    description: "Refresh token issued at login",
  })
  refreshToken: string;
}

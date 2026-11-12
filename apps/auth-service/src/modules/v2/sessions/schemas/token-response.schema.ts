import z from "zod";

export const tokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type TokenResponseDto = z.infer<typeof tokenResponseSchema>;

export const accessTokenResponseSchema = z.object({
  accessToken: z.string(),
});

export type AccessTokenResponseDto = z.infer<typeof accessTokenResponseSchema>;

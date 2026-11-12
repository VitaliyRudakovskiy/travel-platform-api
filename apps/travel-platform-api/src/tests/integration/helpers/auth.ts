import { type INestApplication } from "@nestjs/common";
import request from "supertest";
import { type TestUser } from "./factories";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export async function login(app: INestApplication, user: TestUser): Promise<Tokens> {
  const response = await request(app.getHttpServer())
    .post("/api/v2/sessions")
    .send({ email: user.email, password: user.password })
    .expect(201);

  return response.body as Tokens;
}

export const bearer = (accessToken: string): [string, string] => [
  "Authorization",
  `Bearer ${accessToken}`,
];

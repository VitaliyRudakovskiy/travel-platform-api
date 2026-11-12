import { PrismaService } from "../../prisma/prisma.service";
import { prismaServiceMock } from "../mocks/prisma-service.mock";

export const providePrisma = () => ({
  provide: PrismaService,
  useValue: prismaServiceMock,
});

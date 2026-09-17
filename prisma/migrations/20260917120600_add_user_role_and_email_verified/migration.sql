-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Agent', 'User');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'User';

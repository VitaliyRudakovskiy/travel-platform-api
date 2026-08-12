/*
  Warnings:

  - You are about to alter the column `description` on the `destinations` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "destinations" ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "destinations_name_idx" ON "destinations"("name");

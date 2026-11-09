-- AlterTable
ALTER TABLE "notifications" ADD COLUMN "booking_id" TEXT;

-- Backfill booking_id for existing booking notifications from payload
UPDATE "notifications" AS n
SET "booking_id" = n."payload"->>'bookingId'
WHERE n."payload" ? 'bookingId'
  AND EXISTS (SELECT 1 FROM "bookings" AS b WHERE b."id" = n."payload"->>'bookingId');

-- CreateIndex
CREATE INDEX "notifications_booking_id_idx" ON "notifications"("booking_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

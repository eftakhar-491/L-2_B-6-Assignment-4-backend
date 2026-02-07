-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('active', 'pending', 'rejected');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdByUserId" UUID,
ADD COLUMN     "status" "CategoryStatus" NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "Category_status_idx" ON "Category"("status");

-- CreateIndex
CREATE INDEX "Category_createdByUserId_idx" ON "Category"("createdByUserId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

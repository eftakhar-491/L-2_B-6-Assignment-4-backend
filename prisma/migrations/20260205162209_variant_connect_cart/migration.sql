/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "deletedAt";

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantOptionId_fkey" FOREIGN KEY ("variantOptionId") REFERENCES "MealVariantOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

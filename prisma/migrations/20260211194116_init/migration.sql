/*
  Warnings:

  - A unique constraint covering the columns `[cartId,mealId,optionKey]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CartItem_cartId_mealId_variantOptionId_key";

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "optionKey" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "CartItemOption" (
    "id" UUID NOT NULL,
    "cartItemId" UUID NOT NULL,
    "variantOptionId" UUID NOT NULL,
    "priceDelta" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "CartItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CartItemOption_cartItemId_idx" ON "CartItemOption"("cartItemId");

-- CreateIndex
CREATE INDEX "CartItemOption_variantOptionId_idx" ON "CartItemOption"("variantOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItemOption_cartItemId_variantOptionId_key" ON "CartItemOption"("cartItemId", "variantOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_mealId_optionKey_key" ON "CartItem"("cartId", "mealId", "optionKey");

-- AddForeignKey
ALTER TABLE "CartItemOption" ADD CONSTRAINT "CartItemOption_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItemOption" ADD CONSTRAINT "CartItemOption_variantOptionId_fkey" FOREIGN KEY ("variantOptionId") REFERENCES "MealVariantOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'provider', 'admin');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('placed', 'preparing', 'ready', 'delivered', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash_on_delivery', 'bkash', 'stripe', 'sslcommerz');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'customer',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isSubscribed" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "logoSrc" TEXT,
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderCategory" (
    "id" UUID NOT NULL,
    "providerProfileId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" UUID NOT NULL,
    "providerProfileId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDesc" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealImage" (
    "id" UUID NOT NULL,
    "mealId" UUID NOT NULL,
    "src" TEXT NOT NULL,
    "publicId" TEXT,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealVariant" (
    "id" UUID NOT NULL,
    "mealId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealVariantOption" (
    "id" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "priceDelta" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealVariantOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealCategory" (
    "id" UUID NOT NULL,
    "mealId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietaryPreference" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DietaryPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealDietaryPreference" (
    "id" UUID NOT NULL,
    "mealId" UUID NOT NULL,
    "dietaryPreferenceId" UUID NOT NULL,

    CONSTRAINT "MealDietaryPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "label" TEXT,
    "fullAddress" TEXT NOT NULL,
    "lat" DECIMAL(65,30),
    "lng" DECIMAL(65,30),
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "providerProfileId" UUID NOT NULL,
    "deliveryAddressId" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'placed',
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'cash_on_delivery',
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preparedAt" TIMESTAMP(3),
    "readyAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "mealId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItemOption" (
    "id" UUID NOT NULL,
    "orderItemId" UUID NOT NULL,
    "variantOptionId" UUID NOT NULL,
    "priceDelta" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "OrderItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "mealId" UUID NOT NULL,
    "orderId" UUID,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" UUID NOT NULL,
    "cartId" UUID NOT NULL,
    "mealId" UUID NOT NULL,
    "variantOptionId" UUID,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModerationLog" (
    "id" UUID NOT NULL,
    "adminUserId" UUID NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" UUID NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" UUID NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_key" ON "ProviderProfile"("userId");

-- CreateIndex
CREATE INDEX "ProviderProfile_userId_idx" ON "ProviderProfile"("userId");

-- CreateIndex
CREATE INDEX "ProviderProfile_isVerified_idx" ON "ProviderProfile"("isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "ProviderCategory_providerProfileId_idx" ON "ProviderCategory"("providerProfileId");

-- CreateIndex
CREATE INDEX "ProviderCategory_categoryId_idx" ON "ProviderCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderCategory_providerProfileId_categoryId_key" ON "ProviderCategory"("providerProfileId", "categoryId");

-- CreateIndex
CREATE INDEX "Meal_providerProfileId_idx" ON "Meal"("providerProfileId");

-- CreateIndex
CREATE INDEX "Meal_isActive_idx" ON "Meal"("isActive");

-- CreateIndex
CREATE INDEX "Meal_isFeatured_idx" ON "Meal"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "Meal_providerProfileId_slug_key" ON "Meal"("providerProfileId", "slug");

-- CreateIndex
CREATE INDEX "MealImage_mealId_idx" ON "MealImage"("mealId");

-- CreateIndex
CREATE INDEX "MealVariant_mealId_idx" ON "MealVariant"("mealId");

-- CreateIndex
CREATE INDEX "MealVariantOption_variantId_idx" ON "MealVariantOption"("variantId");

-- CreateIndex
CREATE INDEX "MealCategory_mealId_idx" ON "MealCategory"("mealId");

-- CreateIndex
CREATE INDEX "MealCategory_categoryId_idx" ON "MealCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MealCategory_mealId_categoryId_key" ON "MealCategory"("mealId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "DietaryPreference_name_key" ON "DietaryPreference"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DietaryPreference_slug_key" ON "DietaryPreference"("slug");

-- CreateIndex
CREATE INDEX "MealDietaryPreference_mealId_idx" ON "MealDietaryPreference"("mealId");

-- CreateIndex
CREATE INDEX "MealDietaryPreference_dietaryPreferenceId_idx" ON "MealDietaryPreference"("dietaryPreferenceId");

-- CreateIndex
CREATE UNIQUE INDEX "MealDietaryPreference_mealId_dietaryPreferenceId_key" ON "MealDietaryPreference"("mealId", "dietaryPreferenceId");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Order_providerProfileId_idx" ON "Order"("providerProfileId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_placedAt_idx" ON "Order"("placedAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_mealId_idx" ON "OrderItem"("mealId");

-- CreateIndex
CREATE INDEX "OrderItemOption_orderItemId_idx" ON "OrderItemOption"("orderItemId");

-- CreateIndex
CREATE INDEX "OrderItemOption_variantOptionId_idx" ON "OrderItemOption"("variantOptionId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_mealId_idx" ON "Review"("mealId");

-- CreateIndex
CREATE INDEX "Review_orderId_idx" ON "Review"("orderId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_mealId_key" ON "Review"("userId", "mealId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

-- CreateIndex
CREATE INDEX "CartItem_mealId_idx" ON "CartItem"("mealId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_mealId_variantOptionId_key" ON "CartItem"("cartId", "mealId", "variantOptionId");

-- CreateIndex
CREATE INDEX "ModerationLog_adminUserId_idx" ON "ModerationLog"("adminUserId");

-- CreateIndex
CREATE INDEX "ModerationLog_targetType_targetId_idx" ON "ModerationLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "ModerationLog_createdAt_idx" ON "ModerationLog"("createdAt");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategory" ADD CONSTRAINT "ProviderCategory_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategory" ADD CONSTRAINT "ProviderCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealImage" ADD CONSTRAINT "MealImage_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealVariant" ADD CONSTRAINT "MealVariant_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealVariantOption" ADD CONSTRAINT "MealVariantOption_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "MealVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealCategory" ADD CONSTRAINT "MealCategory_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealCategory" ADD CONSTRAINT "MealCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDietaryPreference" ADD CONSTRAINT "MealDietaryPreference_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealDietaryPreference" ADD CONSTRAINT "MealDietaryPreference_dietaryPreferenceId_fkey" FOREIGN KEY ("dietaryPreferenceId") REFERENCES "DietaryPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "ProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryAddressId_fkey" FOREIGN KEY ("deliveryAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemOption" ADD CONSTRAINT "OrderItemOption_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItemOption" ADD CONSTRAINT "OrderItemOption_variantOptionId_fkey" FOREIGN KEY ("variantOptionId") REFERENCES "MealVariantOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModerationLog" ADD CONSTRAINT "ModerationLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

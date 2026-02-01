// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum UserRole {\n  customer\n  provider\n  admin\n}\n\nenum OrderStatus {\n  placed\n  preparing\n  ready\n  delivered\n  cancelled\n}\n\nenum PaymentMethod {\n  cash_on_delivery\n  bkash\n  stripe\n  sslcommerz\n}\n\nmodel User {\n  id        String    @id @default(uuid()) @db.Uuid\n  email     String    @unique\n  phone     String?\n  role      UserRole  @default(customer)\n  isActive  Boolean   @default(true)\n  deletedAt DateTime?\n\n  providerProfile ProviderProfile?\n  addresses       Address[]\n  orders          Order[]\n  reviews         Review[]\n  cart            Cart?\n  moderationLogs  ModerationLog[]\n\n  name          String?\n  emailVerified Boolean   @default(false)\n  image         String?\n  status        String    @default("ACTIVE")\n  isSubscribed  Boolean?  @default(false)\n  sessions      Session[]\n  accounts      Account[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([role])\n  @@index([email])\n  @@map("user")\n}\n\nmodel ProviderProfile {\n  id          String   @id @default(uuid()) @db.Uuid\n  userId      String   @unique @db.Uuid\n  name        String\n  description String?\n  address     String?\n  phone       String?\n  website     String?\n  logoSrc     String?\n  rating      Decimal  @default(0)\n  isVerified  Boolean  @default(false)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  user       User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals      Meal[]\n  categories ProviderCategory[]\n  orders     Order[]\n\n  @@index([userId])\n  @@index([isVerified])\n}\n\nmodel Category {\n  id          String   @id @default(uuid()) @db.Uuid\n  name        String   @unique\n  slug        String   @unique\n  description String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  meals     MealCategory[]\n  providers ProviderCategory[]\n}\n\nmodel ProviderCategory {\n  id                String   @id @default(uuid()) @db.Uuid\n  providerProfileId String   @db.Uuid\n  categoryId        String   @db.Uuid\n  createdAt         DateTime @default(now())\n\n  providerProfile ProviderProfile @relation(fields: [providerProfileId], references: [id], onDelete: Cascade)\n  category        Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([providerProfileId, categoryId])\n  @@index([providerProfileId])\n  @@index([categoryId])\n}\n\nmodel Meal {\n  id                String    @id @default(uuid()) @db.Uuid\n  providerProfileId String    @db.Uuid\n  title             String\n  slug              String\n  description       String?\n  shortDesc         String?\n  price             Decimal\n  currency          String    @default("USD")\n  isActive          Boolean   @default(true)\n  isFeatured        Boolean   @default(false)\n  stock             Int?\n  deletedAt         DateTime?\n  createdAt         DateTime  @default(now())\n  updatedAt         DateTime  @updatedAt\n\n  providerProfile ProviderProfile         @relation(fields: [providerProfileId], references: [id], onDelete: Cascade)\n  images          MealImage[]\n  variants        MealVariant[]\n  categories      MealCategory[]\n  dietaryTags     MealDietaryPreference[]\n  orderItems      OrderItem[]\n  reviews         Review[]\n  cartItems       CartItem[]\n\n  @@unique([providerProfileId, slug])\n  @@index([providerProfileId])\n  @@index([isActive])\n  @@index([isFeatured])\n}\n\nmodel MealImage {\n  id        String   @id @default(uuid()) @db.Uuid\n  mealId    String   @db.Uuid\n  src       String\n  publicId  String?\n  altText   String?\n  isPrimary Boolean  @default(false)\n  createdAt DateTime @default(now())\n\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n}\n\nmodel MealVariant {\n  id         String   @id @default(uuid()) @db.Uuid\n  mealId     String   @db.Uuid\n  name       String\n  isRequired Boolean  @default(false)\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  meal    Meal                @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  options MealVariantOption[]\n\n  @@index([mealId])\n}\n\nmodel MealVariantOption {\n  id         String   @id @default(uuid()) @db.Uuid\n  variantId  String   @db.Uuid\n  title      String\n  priceDelta Decimal  @default(0)\n  isDefault  Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  variant          MealVariant       @relation(fields: [variantId], references: [id], onDelete: Cascade)\n  orderItemOptions OrderItemOption[]\n\n  @@index([variantId])\n}\n\nmodel MealCategory {\n  id         String   @id @default(uuid()) @db.Uuid\n  mealId     String   @db.Uuid\n  categoryId String   @db.Uuid\n  createdAt  DateTime @default(now())\n\n  meal     Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([mealId, categoryId])\n  @@index([mealId])\n  @@index([categoryId])\n}\n\nmodel DietaryPreference {\n  id        String   @id @default(uuid()) @db.Uuid\n  name      String   @unique\n  slug      String   @unique\n  createdAt DateTime @default(now())\n\n  meals MealDietaryPreference[]\n}\n\nmodel MealDietaryPreference {\n  id                  String @id @default(uuid()) @db.Uuid\n  mealId              String @db.Uuid\n  dietaryPreferenceId String @db.Uuid\n\n  meal              Meal              @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  dietaryPreference DietaryPreference @relation(fields: [dietaryPreferenceId], references: [id], onDelete: Cascade)\n\n  @@unique([mealId, dietaryPreferenceId])\n  @@index([mealId])\n  @@index([dietaryPreferenceId])\n}\n\nmodel Address {\n  id          String   @id @default(uuid()) @db.Uuid\n  userId      String   @db.Uuid\n  label       String?\n  fullAddress String\n  lat         Decimal?\n  lng         Decimal?\n  phone       String?\n  createdAt   DateTime @default(now())\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  orders Order[]\n\n  @@index([userId])\n}\n\nmodel Order {\n  id                String        @id @default(uuid()) @db.Uuid\n  userId            String        @db.Uuid\n  providerProfileId String        @db.Uuid\n  deliveryAddressId String        @db.Uuid\n  status            OrderStatus   @default(placed)\n  totalAmount       Decimal\n  currency          String        @default("USD")\n  paymentMethod     PaymentMethod @default(cash_on_delivery)\n  placedAt          DateTime      @default(now())\n  preparedAt        DateTime?\n  readyAt           DateTime?\n  deliveredAt       DateTime?\n  cancelledAt       DateTime?\n  notes             String?\n  createdAt         DateTime      @default(now())\n  updatedAt         DateTime      @updatedAt\n\n  user            User            @relation(fields: [userId], references: [id])\n  providerProfile ProviderProfile @relation(fields: [providerProfileId], references: [id])\n  address         Address         @relation(fields: [deliveryAddressId], references: [id])\n  items           OrderItem[]\n  reviews         Review[]\n\n  @@index([userId])\n  @@index([providerProfileId])\n  @@index([status])\n  @@index([placedAt])\n}\n\nmodel OrderItem {\n  id        String   @id @default(uuid()) @db.Uuid\n  orderId   String   @db.Uuid\n  mealId    String   @db.Uuid\n  quantity  Int      @default(1)\n  unitPrice Decimal\n  subtotal  Decimal\n  notes     String?\n  createdAt DateTime @default(now())\n\n  order   Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal    Meal              @relation(fields: [mealId], references: [id])\n  options OrderItemOption[]\n\n  @@index([orderId])\n  @@index([mealId])\n}\n\nmodel OrderItemOption {\n  id              String  @id @default(uuid()) @db.Uuid\n  orderItemId     String  @db.Uuid\n  variantOptionId String  @db.Uuid\n  priceDelta      Decimal @default(0)\n\n  orderItem     OrderItem         @relation(fields: [orderItemId], references: [id], onDelete: Cascade)\n  variantOption MealVariantOption @relation(fields: [variantOptionId], references: [id])\n\n  @@index([orderItemId])\n  @@index([variantOptionId])\n}\n\nmodel Review {\n  id        String   @id @default(uuid()) @db.Uuid\n  userId    String   @db.Uuid\n  mealId    String   @db.Uuid\n  orderId   String?  @db.Uuid\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user  User   @relation(fields: [userId], references: [id])\n  meal  Meal   @relation(fields: [mealId], references: [id])\n  order Order? @relation(fields: [orderId], references: [id])\n\n  @@unique([userId, mealId])\n  @@index([userId])\n  @@index([mealId])\n  @@index([orderId])\n  @@index([rating])\n}\n\nmodel Cart {\n  id        String   @id @default(uuid()) @db.Uuid\n  userId    String   @unique @db.Uuid\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  items CartItem[]\n}\n\nmodel CartItem {\n  id              String   @id @default(uuid()) @db.Uuid\n  cartId          String   @db.Uuid\n  mealId          String   @db.Uuid\n  variantOptionId String?  @db.Uuid\n  quantity        Int      @default(1)\n  createdAt       DateTime @default(now())\n\n  cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  meal Meal @relation(fields: [mealId], references: [id])\n\n  @@unique([cartId, mealId, variantOptionId])\n  @@index([cartId])\n  @@index([mealId])\n}\n\nmodel ModerationLog {\n  id          String   @id @default(uuid()) @db.Uuid\n  adminUserId String   @db.Uuid\n  targetType  String\n  targetId    String\n  action      String\n  reason      String?\n  createdAt   DateTime @default(now())\n\n  admin User @relation(fields: [adminUserId], references: [id])\n\n  @@index([adminUserId])\n  @@index([targetType, targetId])\n  @@index([createdAt])\n}\n\nmodel Session {\n  id        String   @id @default(uuid()) @db.Uuid\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String   @db.Uuid\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id @default(uuid()) @db.Uuid\n  accountId             String\n  providerId            String\n  userId                String    @db.Uuid\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid()) @db.Uuid\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"moderationLogs","kind":"object","type":"ModerationLog","relationName":"ModerationLogToUser"},{"name":"name","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"isSubscribed","kind":"scalar","type":"Boolean"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"logoSrc","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Decimal"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"categories","kind":"object","type":"ProviderCategory","relationName":"ProviderCategoryToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"MealCategory","relationName":"CategoryToMealCategory"},{"name":"providers","kind":"object","type":"ProviderCategory","relationName":"CategoryToProviderCategory"}],"dbName":null},"ProviderCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderCategoryToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProviderCategory"}],"dbName":null},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortDesc","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"images","kind":"object","type":"MealImage","relationName":"MealToMealImage"},{"name":"variants","kind":"object","type":"MealVariant","relationName":"MealToMealVariant"},{"name":"categories","kind":"object","type":"MealCategory","relationName":"MealToMealCategory"},{"name":"dietaryTags","kind":"object","type":"MealDietaryPreference","relationName":"MealToMealDietaryPreference"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMeal"}],"dbName":null},"MealImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"src","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealImage"}],"dbName":null},"MealVariant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isRequired","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealVariant"},{"name":"options","kind":"object","type":"MealVariantOption","relationName":"MealVariantToMealVariantOption"}],"dbName":null},"MealVariantOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"variantId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"priceDelta","kind":"scalar","type":"Decimal"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"variant","kind":"object","type":"MealVariant","relationName":"MealVariantToMealVariantOption"},{"name":"orderItemOptions","kind":"object","type":"OrderItemOption","relationName":"MealVariantOptionToOrderItemOption"}],"dbName":null},"MealCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealCategory"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMealCategory"}],"dbName":null},"DietaryPreference":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"MealDietaryPreference","relationName":"DietaryPreferenceToMealDietaryPreference"}],"dbName":null},"MealDietaryPreference":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"dietaryPreferenceId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealDietaryPreference"},{"name":"dietaryPreference","kind":"object","type":"DietaryPreference","relationName":"DietaryPreferenceToMealDietaryPreference"}],"dbName":null},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"fullAddress","kind":"scalar","type":"String"},{"name":"lat","kind":"scalar","type":"Decimal"},{"name":"lng","kind":"scalar","type":"Decimal"},{"name":"phone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerProfileId","kind":"scalar","type":"String"},{"name":"deliveryAddressId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"preparedAt","kind":"scalar","type":"DateTime"},{"name":"readyAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"OrderToReview"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"},{"name":"options","kind":"object","type":"OrderItemOption","relationName":"OrderItemToOrderItemOption"}],"dbName":null},"OrderItemOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderItemId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"priceDelta","kind":"scalar","type":"Decimal"},{"name":"orderItem","kind":"object","type":"OrderItem","relationName":"OrderItemToOrderItemOption"},{"name":"variantOption","kind":"object","type":"MealVariantOption","relationName":"MealVariantOptionToOrderItemOption"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"CartItemToMeal"}],"dbName":null},"ModerationLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminUserId","kind":"scalar","type":"String"},{"name":"targetType","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"admin","kind":"object","type":"User","relationName":"ModerationLogToUser"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/utils/sendEmail.ts
import ejs from "ejs";
import nodemailer from "nodemailer";
import path2 from "path";

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariables = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "FRONTEND_URL",
    "EXPRESS_SESSION_SECRET",
    "BETTER_AUTH_SECRET",
    "CLOUDINARY_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    // "BCRYPT_SALT_ROUND",
    // "JWT_ACCESS_SECRET",
    // "JWT_REFRESH_SECRET",
    // "JWT_REFRESH_EXPIRES",
    // "JWT_ACCESS_EXPIRES",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    // "GOOGLE_CALLBACK_URL",
    // "EXPRESS_SESSION_SECRET",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_FROM"
    // "GEO_API_KEY",
    // "REDIS_USERNAME",
    // "REDIS_PASSWORD",
    // "REDIS_HOST",
    // "REDIS_PORT",
  ];
  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`);
    }
  });
  return {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    // BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND) || 10,
    // JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    // JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    // JWT_ACCESS_EXPIRES: (process.env.JWT_ACCESS_EXPIRES as string) || "1h",
    // JWT_REFRESH_EXPIRES: (process.env.JWT_REFRESH_EXPIRES as string) || "7d",
    FRONTEND_URL: process.env.FRONTEND_URL,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    // EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_FROM: process.env.SMTP_FROM
    }
    // GEO_API_KEY: process.env.GEO_API_KEY!,
    // REDIS_USERNAME: process.env.REDIS_USERNAME,
    // REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    // REDIS_HOST: process.env.REDIS_HOST,
    // REDIS_PORT: Number(process.env.REDIS_PORT),
  };
};
var envVars = loadEnvVariables();

// src/app/helper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/utils/sendEmail.ts
var transporter = nodemailer.createTransport({
  // port: envVars.EMAIL_SENDER.SMTP_PORT,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  host: envVars.EMAIL_SENDER.SMTP_HOST
});
var sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments
}) => {
  try {
    const rootDir = path2.resolve(process.cwd());
    const templatePath = path2.join(
      rootDir,
      "src",
      "app",
      "utils",
      "templates",
      `${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.log("email sending error", error.message);
    throw new AppError_default(401, "Email error");
  }
};

// src/app/modules/user/user.interface.ts
var Role = /* @__PURE__ */ ((Role2) => {
  Role2["ADMIN"] = "ADMIN";
  Role2["USER"] = "USER";
  return Role2;
})(Role || {});
var UserStatus = /* @__PURE__ */ ((UserStatus2) => {
  UserStatus2["ACTIVE"] = "ACTIVE";
  UserStatus2["BLOCKED"] = "BLOCKED";
  UserStatus2["DELETED"] = "DELETED";
  return UserStatus2;
})(UserStatus || {});

// src/app/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL],
  user: {
    additionalFields: {
      role: {
        type: [...Object.values(Role)],
        required: true,
        defaultValue: "USER"
      },
      phone: {
        type: "string",
        required: true,
        unique: true
      },
      status: {
        type: [...Object.values(UserStatus)],
        required: false,
        defaultValue: "ACTIVE"
      },
      isSubscribed: {
        type: "boolean",
        required: false,
        defaultValue: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        templateName: "forgetPassword",
        templateData: {
          name: user.name,
          resetUILink: `${envVars.FRONTEND_URL}/auth/reset-password?id=${user.id}&token=${token}`
        }
      });
    },
    onPasswordReset: async ({ user }, request) => {
      await prisma.session.deleteMany({
        where: {
          userId: user.id
        }
      });
      console.log(`Password for user ${user.email} has been reset.`);
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const resetUILink = `${envVars.FRONTEND_URL}/auth/verify?id=${user.id}&token=${token}`;
      sendEmail({
        to: user.email,
        subject: "Verify your email address",
        templateName: "verifyEmail",
        templateData: {
          name: user.name,
          resetUILink
        }
      });
      console.log("Verification URL:", url);
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      accessType: "offline"
    }
  }
});

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
  })
);
app.use("/api/auth", toNodeHandler(auth));
app.get("/", (_, res) => {
  res.send({
    message: "Welcome to the APP, this is a E-Commerce API",
    success: true
  });
});

// src/server.ts
var server;
var PORT = process.env.PORT || 5e3;
var startServer = async () => {
  try {
    server = app.listen(PORT, () => {
      console.log(`\u2705\u2705\u2705\u2705 Server is listening to http://localhost:${PORT} `);
    });
  } catch (error) {
    console.log("\u274C\u274C\u274C\u274C\u274C", error);
  }
};
(async () => {
  await startServer();
})();
process.on("SIGTERM", () => {
  console.log("SIGTERM signal recieved... Server shutting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal recieved... Server shutting down..");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejecttion detected... Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception detected... Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

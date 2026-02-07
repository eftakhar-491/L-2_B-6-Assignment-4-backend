var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// src/app/routes/index.ts
import { Router as Router8 } from "express";

// src/app/modules/user/user.route.ts
import { Router } from "express";

// node_modules/http-status-codes/build/es/legacy.js
var ACCEPTED = 202;
var BAD_GATEWAY = 502;
var BAD_REQUEST = 400;
var CONFLICT = 409;
var CONTINUE = 100;
var CREATED = 201;
var EXPECTATION_FAILED = 417;
var FORBIDDEN = 403;
var GATEWAY_TIMEOUT = 504;
var GONE = 410;
var HTTP_VERSION_NOT_SUPPORTED = 505;
var IM_A_TEAPOT = 418;
var INSUFFICIENT_SPACE_ON_RESOURCE = 419;
var INSUFFICIENT_STORAGE = 507;
var INTERNAL_SERVER_ERROR = 500;
var LENGTH_REQUIRED = 411;
var LOCKED = 423;
var METHOD_FAILURE = 420;
var METHOD_NOT_ALLOWED = 405;
var MOVED_PERMANENTLY = 301;
var MOVED_TEMPORARILY = 302;
var MULTI_STATUS = 207;
var MULTIPLE_CHOICES = 300;
var NETWORK_AUTHENTICATION_REQUIRED = 511;
var NO_CONTENT = 204;
var NON_AUTHORITATIVE_INFORMATION = 203;
var NOT_ACCEPTABLE = 406;
var NOT_FOUND = 404;
var NOT_IMPLEMENTED = 501;
var NOT_MODIFIED = 304;
var OK = 200;
var PARTIAL_CONTENT = 206;
var PAYMENT_REQUIRED = 402;
var PERMANENT_REDIRECT = 308;
var PRECONDITION_FAILED = 412;
var PRECONDITION_REQUIRED = 428;
var PROCESSING = 102;
var PROXY_AUTHENTICATION_REQUIRED = 407;
var REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
var REQUEST_TIMEOUT = 408;
var REQUEST_TOO_LONG = 413;
var REQUEST_URI_TOO_LONG = 414;
var REQUESTED_RANGE_NOT_SATISFIABLE = 416;
var RESET_CONTENT = 205;
var SEE_OTHER = 303;
var SERVICE_UNAVAILABLE = 503;
var SWITCHING_PROTOCOLS = 101;
var TEMPORARY_REDIRECT = 307;
var TOO_MANY_REQUESTS = 429;
var UNAUTHORIZED = 401;
var UNPROCESSABLE_ENTITY = 422;
var UNSUPPORTED_MEDIA_TYPE = 415;
var USE_PROXY = 305;
var legacy_default = {
  ACCEPTED,
  BAD_GATEWAY,
  BAD_REQUEST,
  CONFLICT,
  CONTINUE,
  CREATED,
  EXPECTATION_FAILED,
  FORBIDDEN,
  GATEWAY_TIMEOUT,
  GONE,
  HTTP_VERSION_NOT_SUPPORTED,
  IM_A_TEAPOT,
  INSUFFICIENT_SPACE_ON_RESOURCE,
  INSUFFICIENT_STORAGE,
  INTERNAL_SERVER_ERROR,
  LENGTH_REQUIRED,
  LOCKED,
  METHOD_FAILURE,
  METHOD_NOT_ALLOWED,
  MOVED_PERMANENTLY,
  MOVED_TEMPORARILY,
  MULTI_STATUS,
  MULTIPLE_CHOICES,
  NETWORK_AUTHENTICATION_REQUIRED,
  NO_CONTENT,
  NON_AUTHORITATIVE_INFORMATION,
  NOT_ACCEPTABLE,
  NOT_FOUND,
  NOT_IMPLEMENTED,
  NOT_MODIFIED,
  OK,
  PARTIAL_CONTENT,
  PAYMENT_REQUIRED,
  PERMANENT_REDIRECT,
  PRECONDITION_FAILED,
  PRECONDITION_REQUIRED,
  PROCESSING,
  PROXY_AUTHENTICATION_REQUIRED,
  REQUEST_HEADER_FIELDS_TOO_LARGE,
  REQUEST_TIMEOUT,
  REQUEST_TOO_LONG,
  REQUEST_URI_TOO_LONG,
  REQUESTED_RANGE_NOT_SATISFIABLE,
  RESET_CONTENT,
  SEE_OTHER,
  SERVICE_UNAVAILABLE,
  SWITCHING_PROTOCOLS,
  TEMPORARY_REDIRECT,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  UNSUPPORTED_MEDIA_TYPE,
  USE_PROXY
};

// node_modules/http-status-codes/build/es/utils.js
var statusCodeToReasonPhrase = {
  "202": "Accepted",
  "502": "Bad Gateway",
  "400": "Bad Request",
  "409": "Conflict",
  "100": "Continue",
  "201": "Created",
  "417": "Expectation Failed",
  "424": "Failed Dependency",
  "403": "Forbidden",
  "504": "Gateway Timeout",
  "410": "Gone",
  "505": "HTTP Version Not Supported",
  "418": "I'm a teapot",
  "419": "Insufficient Space on Resource",
  "507": "Insufficient Storage",
  "500": "Internal Server Error",
  "411": "Length Required",
  "423": "Locked",
  "420": "Method Failure",
  "405": "Method Not Allowed",
  "301": "Moved Permanently",
  "302": "Moved Temporarily",
  "207": "Multi-Status",
  "300": "Multiple Choices",
  "511": "Network Authentication Required",
  "204": "No Content",
  "203": "Non Authoritative Information",
  "406": "Not Acceptable",
  "404": "Not Found",
  "501": "Not Implemented",
  "304": "Not Modified",
  "200": "OK",
  "206": "Partial Content",
  "402": "Payment Required",
  "308": "Permanent Redirect",
  "412": "Precondition Failed",
  "428": "Precondition Required",
  "102": "Processing",
  "103": "Early Hints",
  "426": "Upgrade Required",
  "407": "Proxy Authentication Required",
  "431": "Request Header Fields Too Large",
  "408": "Request Timeout",
  "413": "Request Entity Too Large",
  "414": "Request-URI Too Long",
  "416": "Requested Range Not Satisfiable",
  "205": "Reset Content",
  "303": "See Other",
  "503": "Service Unavailable",
  "101": "Switching Protocols",
  "307": "Temporary Redirect",
  "429": "Too Many Requests",
  "401": "Unauthorized",
  "451": "Unavailable For Legal Reasons",
  "422": "Unprocessable Entity",
  "415": "Unsupported Media Type",
  "305": "Use Proxy",
  "421": "Misdirected Request"
};
var reasonPhraseToStatusCode = {
  "Accepted": 202,
  "Bad Gateway": 502,
  "Bad Request": 400,
  "Conflict": 409,
  "Continue": 100,
  "Created": 201,
  "Expectation Failed": 417,
  "Failed Dependency": 424,
  "Forbidden": 403,
  "Gateway Timeout": 504,
  "Gone": 410,
  "HTTP Version Not Supported": 505,
  "I'm a teapot": 418,
  "Insufficient Space on Resource": 419,
  "Insufficient Storage": 507,
  "Internal Server Error": 500,
  "Length Required": 411,
  "Locked": 423,
  "Method Failure": 420,
  "Method Not Allowed": 405,
  "Moved Permanently": 301,
  "Moved Temporarily": 302,
  "Multi-Status": 207,
  "Multiple Choices": 300,
  "Network Authentication Required": 511,
  "No Content": 204,
  "Non Authoritative Information": 203,
  "Not Acceptable": 406,
  "Not Found": 404,
  "Not Implemented": 501,
  "Not Modified": 304,
  "OK": 200,
  "Partial Content": 206,
  "Payment Required": 402,
  "Permanent Redirect": 308,
  "Precondition Failed": 412,
  "Precondition Required": 428,
  "Processing": 102,
  "Early Hints": 103,
  "Upgrade Required": 426,
  "Proxy Authentication Required": 407,
  "Request Header Fields Too Large": 431,
  "Request Timeout": 408,
  "Request Entity Too Large": 413,
  "Request-URI Too Long": 414,
  "Requested Range Not Satisfiable": 416,
  "Reset Content": 205,
  "See Other": 303,
  "Service Unavailable": 503,
  "Switching Protocols": 101,
  "Temporary Redirect": 307,
  "Too Many Requests": 429,
  "Unauthorized": 401,
  "Unavailable For Legal Reasons": 451,
  "Unprocessable Entity": 422,
  "Unsupported Media Type": 415,
  "Use Proxy": 305,
  "Misdirected Request": 421
};

// node_modules/http-status-codes/build/es/utils-functions.js
function getReasonPhrase(statusCode) {
  var result = statusCodeToReasonPhrase[statusCode.toString()];
  if (!result) {
    throw new Error("Status code does not exist: " + statusCode);
  }
  return result;
}
function getStatusCode(reasonPhrase) {
  var result = reasonPhraseToStatusCode[reasonPhrase];
  if (!result) {
    throw new Error("Reason phrase does not exist: " + reasonPhrase);
  }
  return result;
}
var getStatusText = getReasonPhrase;

// node_modules/http-status-codes/build/es/index.js
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var es_default = __assign(__assign({}, legacy_default), {
  getStatusCode,
  getStatusText
});

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
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum UserRole {\n  customer\n  provider\n  admin\n}\n\nenum UserStatus {\n  active\n  blocked\n  pending\n  deleted\n}\n\nenum OrderStatus {\n  placed\n  preparing\n  ready\n  delivered\n  cancelled\n}\n\nenum PaymentMethod {\n  cash_on_delivery\n  bkash\n  stripe\n  sslcommerz\n}\n\nenum CategoryStatus {\n  active\n  pending\n  rejected\n}\n\nmodel User {\n  id       String   @id @default(uuid()) @db.Uuid\n  email    String   @unique\n  phone    String?  @unique\n  role     UserRole @default(customer)\n  isActive Boolean  @default(true)\n\n  providerProfile   ProviderProfile?\n  addresses         Address[]\n  orders            Order[]\n  reviews           Review[]\n  cart              Cart?\n  moderationLogs    ModerationLog[]\n  categoriesCreated Category[]       @relation("CategoryCreator")\n\n  name          String?\n  emailVerified Boolean    @default(false)\n  image         String?\n  status        UserStatus @default(active)\n  isSubscribed  Boolean?   @default(false)\n  sessions      Session[]\n  accounts      Account[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([role])\n  @@index([email])\n  @@map("user")\n}\n\nmodel ProviderProfile {\n  id          String   @id @default(uuid()) @db.Uuid\n  userId      String   @unique @db.Uuid\n  name        String\n  description String?\n  address     String?\n  phone       String?\n  website     String?\n  logoSrc     String?\n  rating      Decimal  @default(0)\n  isVerified  Boolean  @default(false)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  user       User               @relation(fields: [userId], references: [id], onDelete: Cascade)\n  meals      Meal[]\n  categories ProviderCategory[]\n  orders     Order[]\n\n  @@index([userId])\n  @@index([isVerified])\n}\n\nmodel Category {\n  id              String         @id @default(uuid()) @db.Uuid\n  name            String         @unique\n  slug            String         @unique\n  description     String?\n  status          CategoryStatus @default(active)\n  createdByUserId String?        @db.Uuid\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n\n  createdBy User?              @relation("CategoryCreator", fields: [createdByUserId], references: [id])\n  meals     MealCategory[]\n  providers ProviderCategory[]\n\n  @@index([status])\n  @@index([createdByUserId])\n}\n\nmodel ProviderCategory {\n  id                String   @id @default(uuid()) @db.Uuid\n  providerProfileId String   @db.Uuid\n  categoryId        String   @db.Uuid\n  createdAt         DateTime @default(now())\n\n  providerProfile ProviderProfile @relation(fields: [providerProfileId], references: [id], onDelete: Cascade)\n  category        Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([providerProfileId, categoryId])\n  @@index([providerProfileId])\n  @@index([categoryId])\n}\n\nmodel Meal {\n  id                String    @id @default(uuid()) @db.Uuid\n  providerProfileId String    @db.Uuid\n  title             String\n  slug              String\n  description       String?\n  shortDesc         String?\n  price             Decimal\n  currency          String    @default("USD")\n  isActive          Boolean   @default(true)\n  isFeatured        Boolean   @default(false)\n  stock             Int?\n  deletedAt         DateTime?\n  createdAt         DateTime  @default(now())\n  updatedAt         DateTime  @updatedAt\n\n  providerProfile ProviderProfile         @relation(fields: [providerProfileId], references: [id], onDelete: Cascade)\n  images          MealImage[]\n  variants        MealVariant[]\n  categories      MealCategory[]\n  dietaryTags     MealDietaryPreference[]\n  orderItems      OrderItem[]\n  reviews         Review[]\n  cartItems       CartItem[]\n\n  @@unique([providerProfileId, slug])\n  @@index([providerProfileId])\n  @@index([isActive])\n  @@index([isFeatured])\n}\n\nmodel MealImage {\n  id        String   @id @default(uuid()) @db.Uuid\n  mealId    String   @db.Uuid\n  src       String\n  publicId  String?\n  altText   String?\n  isPrimary Boolean  @default(false)\n  createdAt DateTime @default(now())\n\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n}\n\nmodel MealVariant {\n  id         String   @id @default(uuid()) @db.Uuid\n  mealId     String   @db.Uuid\n  name       String\n  isRequired Boolean  @default(false)\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  meal    Meal                @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  options MealVariantOption[]\n\n  @@index([mealId])\n}\n\nmodel MealVariantOption {\n  id         String   @id @default(uuid()) @db.Uuid\n  variantId  String   @db.Uuid\n  title      String\n  priceDelta Decimal  @default(0)\n  isDefault  Boolean  @default(false)\n  createdAt  DateTime @default(now())\n\n  variant          MealVariant       @relation(fields: [variantId], references: [id], onDelete: Cascade)\n  orderItemOptions OrderItemOption[]\n  cartItems        CartItem[]\n\n  @@index([variantId])\n}\n\nmodel MealCategory {\n  id         String   @id @default(uuid()) @db.Uuid\n  mealId     String   @db.Uuid\n  categoryId String   @db.Uuid\n  createdAt  DateTime @default(now())\n\n  meal     Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([mealId, categoryId])\n  @@index([mealId])\n  @@index([categoryId])\n}\n\nmodel DietaryPreference {\n  id        String   @id @default(uuid()) @db.Uuid\n  name      String   @unique\n  slug      String   @unique\n  createdAt DateTime @default(now())\n\n  meals MealDietaryPreference[]\n}\n\nmodel MealDietaryPreference {\n  id                  String @id @default(uuid()) @db.Uuid\n  mealId              String @db.Uuid\n  dietaryPreferenceId String @db.Uuid\n\n  meal              Meal              @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  dietaryPreference DietaryPreference @relation(fields: [dietaryPreferenceId], references: [id], onDelete: Cascade)\n\n  @@unique([mealId, dietaryPreferenceId])\n  @@index([mealId])\n  @@index([dietaryPreferenceId])\n}\n\nmodel Address {\n  id          String   @id @default(uuid()) @db.Uuid\n  userId      String   @db.Uuid\n  label       String?\n  fullAddress String   @db.Text\n  lat         Decimal?\n  lng         Decimal?\n  phone       String?\n  createdAt   DateTime @default(now())\n\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  orders Order[]\n\n  @@index([userId])\n}\n\nmodel Order {\n  id                String        @id @default(uuid()) @db.Uuid\n  userId            String        @db.Uuid\n  providerProfileId String        @db.Uuid\n  deliveryAddressId String        @db.Uuid\n  status            OrderStatus   @default(placed)\n  totalAmount       Decimal\n  currency          String        @default("USD")\n  paymentMethod     PaymentMethod @default(cash_on_delivery)\n  placedAt          DateTime      @default(now())\n  preparedAt        DateTime?\n  readyAt           DateTime?\n  deliveredAt       DateTime?\n  cancelledAt       DateTime?\n  notes             String?\n  createdAt         DateTime      @default(now())\n  updatedAt         DateTime      @updatedAt\n\n  user            User            @relation(fields: [userId], references: [id])\n  providerProfile ProviderProfile @relation(fields: [providerProfileId], references: [id])\n  address         Address         @relation(fields: [deliveryAddressId], references: [id])\n  items           OrderItem[]\n  reviews         Review[]\n\n  @@index([userId])\n  @@index([providerProfileId])\n  @@index([status])\n  @@index([placedAt])\n}\n\nmodel OrderItem {\n  id        String   @id @default(uuid()) @db.Uuid\n  orderId   String   @db.Uuid\n  mealId    String   @db.Uuid\n  quantity  Int      @default(1)\n  unitPrice Decimal\n  subtotal  Decimal\n  notes     String?\n  createdAt DateTime @default(now())\n\n  order   Order             @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal    Meal              @relation(fields: [mealId], references: [id])\n  options OrderItemOption[]\n\n  @@index([orderId])\n  @@index([mealId])\n}\n\nmodel OrderItemOption {\n  id              String  @id @default(uuid()) @db.Uuid\n  orderItemId     String  @db.Uuid\n  variantOptionId String  @db.Uuid\n  priceDelta      Decimal @default(0)\n\n  orderItem     OrderItem         @relation(fields: [orderItemId], references: [id], onDelete: Cascade)\n  variantOption MealVariantOption @relation(fields: [variantOptionId], references: [id])\n\n  @@index([orderItemId])\n  @@index([variantOptionId])\n}\n\nmodel Review {\n  id        String   @id @default(uuid()) @db.Uuid\n  userId    String   @db.Uuid\n  mealId    String   @db.Uuid\n  orderId   String?  @db.Uuid\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user  User   @relation(fields: [userId], references: [id])\n  meal  Meal   @relation(fields: [mealId], references: [id])\n  order Order? @relation(fields: [orderId], references: [id])\n\n  @@unique([userId, mealId])\n  @@index([userId])\n  @@index([mealId])\n  @@index([orderId])\n  @@index([rating])\n}\n\nmodel Cart {\n  id        String   @id @default(uuid()) @db.Uuid\n  userId    String   @unique @db.Uuid\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  items CartItem[]\n}\n\nmodel CartItem {\n  id              String   @id @default(uuid()) @db.Uuid\n  cartId          String   @db.Uuid\n  mealId          String   @db.Uuid\n  variantOptionId String?  @db.Uuid\n  quantity        Int      @default(1)\n  createdAt       DateTime @default(now())\n\n  cart          Cart               @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  meal          Meal               @relation(fields: [mealId], references: [id])\n  variantOption MealVariantOption? @relation(fields: [variantOptionId], references: [id])\n\n  @@unique([cartId, mealId, variantOptionId])\n  @@index([cartId])\n  @@index([mealId])\n}\n\nmodel ModerationLog {\n  id          String   @id @default(uuid()) @db.Uuid\n  adminUserId String   @db.Uuid\n  targetType  String\n  targetId    String\n  action      String\n  reason      String?\n  createdAt   DateTime @default(now())\n\n  admin User @relation(fields: [adminUserId], references: [id])\n\n  @@index([adminUserId])\n  @@index([targetType, targetId])\n  @@index([createdAt])\n}\n\nmodel Session {\n  id        String   @id @default(uuid()) @db.Uuid\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String   @db.Uuid\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id @default(uuid()) @db.Uuid\n  accountId             String\n  providerId            String\n  userId                String    @db.Uuid\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid()) @db.Uuid\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"addresses","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"moderationLogs","kind":"object","type":"ModerationLog","relationName":"ModerationLogToUser"},{"name":"categoriesCreated","kind":"object","type":"Category","relationName":"CategoryCreator"},{"name":"name","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isSubscribed","kind":"scalar","type":"Boolean"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"website","kind":"scalar","type":"String"},{"name":"logoSrc","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Decimal"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"categories","kind":"object","type":"ProviderCategory","relationName":"ProviderCategoryToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CategoryStatus"},{"name":"createdByUserId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"createdBy","kind":"object","type":"User","relationName":"CategoryCreator"},{"name":"meals","kind":"object","type":"MealCategory","relationName":"CategoryToMealCategory"},{"name":"providers","kind":"object","type":"ProviderCategory","relationName":"CategoryToProviderCategory"}],"dbName":null},"ProviderCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderCategoryToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProviderCategory"}],"dbName":null},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"providerProfileId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"shortDesc","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"images","kind":"object","type":"MealImage","relationName":"MealToMealImage"},{"name":"variants","kind":"object","type":"MealVariant","relationName":"MealToMealVariant"},{"name":"categories","kind":"object","type":"MealCategory","relationName":"MealToMealCategory"},{"name":"dietaryTags","kind":"object","type":"MealDietaryPreference","relationName":"MealToMealDietaryPreference"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMeal"}],"dbName":null},"MealImage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"src","kind":"scalar","type":"String"},{"name":"publicId","kind":"scalar","type":"String"},{"name":"altText","kind":"scalar","type":"String"},{"name":"isPrimary","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealImage"}],"dbName":null},"MealVariant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"isRequired","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealVariant"},{"name":"options","kind":"object","type":"MealVariantOption","relationName":"MealVariantToMealVariantOption"}],"dbName":null},"MealVariantOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"variantId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"priceDelta","kind":"scalar","type":"Decimal"},{"name":"isDefault","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"variant","kind":"object","type":"MealVariant","relationName":"MealVariantToMealVariantOption"},{"name":"orderItemOptions","kind":"object","type":"OrderItemOption","relationName":"MealVariantOptionToOrderItemOption"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMealVariantOption"}],"dbName":null},"MealCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealCategory"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMealCategory"}],"dbName":null},"DietaryPreference":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"MealDietaryPreference","relationName":"DietaryPreferenceToMealDietaryPreference"}],"dbName":null},"MealDietaryPreference":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"dietaryPreferenceId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToMealDietaryPreference"},{"name":"dietaryPreference","kind":"object","type":"DietaryPreference","relationName":"DietaryPreferenceToMealDietaryPreference"}],"dbName":null},"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"label","kind":"scalar","type":"String"},{"name":"fullAddress","kind":"scalar","type":"String"},{"name":"lat","kind":"scalar","type":"Decimal"},{"name":"lng","kind":"scalar","type":"Decimal"},{"name":"phone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerProfileId","kind":"scalar","type":"String"},{"name":"deliveryAddressId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"placedAt","kind":"scalar","type":"DateTime"},{"name":"preparedAt","kind":"scalar","type":"DateTime"},{"name":"readyAt","kind":"scalar","type":"DateTime"},{"name":"deliveredAt","kind":"scalar","type":"DateTime"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"OrderToReview"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"unitPrice","kind":"scalar","type":"Decimal"},{"name":"subtotal","kind":"scalar","type":"Decimal"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"},{"name":"options","kind":"object","type":"OrderItemOption","relationName":"OrderItemToOrderItemOption"}],"dbName":null},"OrderItemOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderItemId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"priceDelta","kind":"scalar","type":"Decimal"},{"name":"orderItem","kind":"object","type":"OrderItem","relationName":"OrderItemToOrderItemOption"},{"name":"variantOption","kind":"object","type":"MealVariantOption","relationName":"MealVariantOptionToOrderItemOption"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"variantOptionId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"CartItemToMeal"},{"name":"variantOption","kind":"object","type":"MealVariantOption","relationName":"CartItemToMealVariantOption"}],"dbName":null},"ModerationLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminUserId","kind":"scalar","type":"String"},{"name":"targetType","kind":"scalar","type":"String"},{"name":"targetId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"reason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"admin","kind":"object","type":"User","relationName":"ModerationLogToUser"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
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
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AddressScalarFieldEnum: () => AddressScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  DietaryPreferenceScalarFieldEnum: () => DietaryPreferenceScalarFieldEnum,
  JsonNull: () => JsonNull2,
  MealCategoryScalarFieldEnum: () => MealCategoryScalarFieldEnum,
  MealDietaryPreferenceScalarFieldEnum: () => MealDietaryPreferenceScalarFieldEnum,
  MealImageScalarFieldEnum: () => MealImageScalarFieldEnum,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  MealVariantOptionScalarFieldEnum: () => MealVariantOptionScalarFieldEnum,
  MealVariantScalarFieldEnum: () => MealVariantScalarFieldEnum,
  ModelName: () => ModelName,
  ModerationLogScalarFieldEnum: () => ModerationLogScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemOptionScalarFieldEnum: () => OrderItemOptionScalarFieldEnum,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderCategoryScalarFieldEnum: () => ProviderCategoryScalarFieldEnum,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  ProviderProfile: "ProviderProfile",
  Category: "Category",
  ProviderCategory: "ProviderCategory",
  Meal: "Meal",
  MealImage: "MealImage",
  MealVariant: "MealVariant",
  MealVariantOption: "MealVariantOption",
  MealCategory: "MealCategory",
  DietaryPreference: "DietaryPreference",
  MealDietaryPreference: "MealDietaryPreference",
  Address: "Address",
  Order: "Order",
  OrderItem: "OrderItem",
  OrderItemOption: "OrderItemOption",
  Review: "Review",
  Cart: "Cart",
  CartItem: "CartItem",
  ModerationLog: "ModerationLog",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  phone: "phone",
  role: "role",
  isActive: "isActive",
  name: "name",
  emailVerified: "emailVerified",
  image: "image",
  status: "status",
  isSubscribed: "isSubscribed",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  description: "description",
  address: "address",
  phone: "phone",
  website: "website",
  logoSrc: "logoSrc",
  rating: "rating",
  isVerified: "isVerified",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  status: "status",
  createdByUserId: "createdByUserId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderCategoryScalarFieldEnum = {
  id: "id",
  providerProfileId: "providerProfileId",
  categoryId: "categoryId",
  createdAt: "createdAt"
};
var MealScalarFieldEnum = {
  id: "id",
  providerProfileId: "providerProfileId",
  title: "title",
  slug: "slug",
  description: "description",
  shortDesc: "shortDesc",
  price: "price",
  currency: "currency",
  isActive: "isActive",
  isFeatured: "isFeatured",
  stock: "stock",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealImageScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  src: "src",
  publicId: "publicId",
  altText: "altText",
  isPrimary: "isPrimary",
  createdAt: "createdAt"
};
var MealVariantScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  name: "name",
  isRequired: "isRequired",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealVariantOptionScalarFieldEnum = {
  id: "id",
  variantId: "variantId",
  title: "title",
  priceDelta: "priceDelta",
  isDefault: "isDefault",
  createdAt: "createdAt"
};
var MealCategoryScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  categoryId: "categoryId",
  createdAt: "createdAt"
};
var DietaryPreferenceScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  createdAt: "createdAt"
};
var MealDietaryPreferenceScalarFieldEnum = {
  id: "id",
  mealId: "mealId",
  dietaryPreferenceId: "dietaryPreferenceId"
};
var AddressScalarFieldEnum = {
  id: "id",
  userId: "userId",
  label: "label",
  fullAddress: "fullAddress",
  lat: "lat",
  lng: "lng",
  phone: "phone",
  createdAt: "createdAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  userId: "userId",
  providerProfileId: "providerProfileId",
  deliveryAddressId: "deliveryAddressId",
  status: "status",
  totalAmount: "totalAmount",
  currency: "currency",
  paymentMethod: "paymentMethod",
  placedAt: "placedAt",
  preparedAt: "preparedAt",
  readyAt: "readyAt",
  deliveredAt: "deliveredAt",
  cancelledAt: "cancelledAt",
  notes: "notes",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  mealId: "mealId",
  quantity: "quantity",
  unitPrice: "unitPrice",
  subtotal: "subtotal",
  notes: "notes",
  createdAt: "createdAt"
};
var OrderItemOptionScalarFieldEnum = {
  id: "id",
  orderItemId: "orderItemId",
  variantOptionId: "variantOptionId",
  priceDelta: "priceDelta"
};
var ReviewScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mealId: "mealId",
  orderId: "orderId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  mealId: "mealId",
  variantOptionId: "variantOptionId",
  quantity: "quantity",
  createdAt: "createdAt"
};
var ModerationLogScalarFieldEnum = {
  id: "id",
  adminUserId: "adminUserId",
  targetType: "targetType",
  targetId: "targetId",
  action: "action",
  reason: "reason",
  createdAt: "createdAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
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
  Role2["customer"] = "customer";
  Role2["provider"] = "provider";
  Role2["admin"] = "admin";
  return Role2;
})(Role || {});
var UserStatus = /* @__PURE__ */ ((UserStatus2) => {
  UserStatus2["active"] = "active";
  UserStatus2["blocked"] = "blocked";
  UserStatus2["pending"] = "pending";
  UserStatus2["deleted"] = "deleted";
  return UserStatus2;
})(UserStatus || {});

// src/app/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  advanced: {
    database: {
      generateId: "uuid"
    }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL],
  user: {
    additionalFields: {
      role: {
        type: [...Object.values(Role)],
        required: true,
        defaultValue: "customer"
      },
      phone: {
        type: "string",
        required: true,
        unique: true
      },
      status: {
        type: [...Object.values(UserStatus)],
        required: false,
        defaultValue: "active"
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

// src/app/middlewares/checkAuth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (session?.user && !authRoles.includes(session.user.role)) {
      return res.status(es_default.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to access this resource"
      });
    }
    if (!session?.user) {
      return res.status(es_default.UNAUTHORIZED).json({
        success: false,
        message: "You are not authorized"
      });
    }
    if (!session.user.emailVerified) {
      return res.status(es_default.FORBIDDEN).json({
        success: false,
        message: "Please verify your email to proceed"
      });
    }
    if (session.user.status === "blocked" /* blocked */) {
      return res.status(es_default.FORBIDDEN).json({
        success: false,
        message: "Your account has been blocked. Please contact support."
      });
    }
    if (session.user.status === "deleted" /* deleted */) {
      return res.status(es_default.FORBIDDEN).json({
        success: false,
        message: "Your account has been deleted. Please contact support."
      });
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      emailVerified: session.user.emailVerified,
      phone: session.user.phone,
      status: session.user.status
    };
    next();
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    next(err);
  });
};

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data
  });
};

// src/app/modules/user/user.constant.ts
var userSearchableFields = ["name", "email", "phone"];

// src/app/constants/index.ts
var excludeField = ["searchTerm", "sort", "fields", "page", "limit"];

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  query;
  where = {};
  select;
  orderBy;
  skip;
  take;
  constructor(query) {
    this.query = query;
  }
  /** ---------------- FILTER ---------------- */
  filter() {
    const filter = { ...this.query };
    excludeField.forEach((field) => delete filter[field]);
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        this.where[key] = filter[key];
      }
    });
    return this;
  }
  search(searchableFields) {
    const searchTerm = this.query.searchTerm;
    if (!searchTerm) return this;
    this.where.OR = searchableFields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive"
      }
    }));
    return this;
  }
  sort() {
    const sort = this.query.sort || "createdAt";
    const fields = sort.split(",").map((field) => {
      if (field.startsWith("-")) {
        return { [field.substring(1)]: "desc" };
      }
      return { [field]: "asc" };
    });
    this.orderBy = fields;
    return this;
  }
  fields() {
    if (!this.query.fields) return this;
    const fields = this.query.fields.split(",");
    this.select = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    return this;
  }
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    this.skip = (page - 1) * limit;
    this.take = limit;
    return this;
  }
  // build() {
  //   return {
  //     where: this.where,
  //     select: this.select,
  //     orderBy: this.orderBy,
  //     skip: this.skip,
  //     take: this.take,
  //   };
  // }
  build() {
    const query = {
      where: this.where
    };
    if (this.select) {
      query.select = this.select;
    }
    if (this.orderBy) {
      query.orderBy = this.orderBy;
    }
    if (this.skip !== void 0) {
      query.skip = this.skip;
    }
    if (this.take !== void 0) {
      query.take = this.take;
    }
    return query;
  }
  async getMeta(prismaModel) {
    const total = await prismaModel.count({
      where: this.where
    });
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    return {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    };
  }
};

// src/app/modules/user/user.service.ts
var getAllUsers = async (query) => {
  const qb = new QueryBuilder(query).filter().search(userSearchableFields).sort().fields().paginate();
  const users = await prisma.user.findMany(
    qb.build()
  );
  const meta = await qb.getMeta(prisma.user);
  return {
    meta,
    data: users
  };
};
var getMe = async (headers) => {
  const session = await auth.api.getSession({
    headers
  });
  if (!session?.user) {
    throw new AppError_default(es_default.NOT_FOUND, "User not found");
  }
  return session.user;
};
var updateMe = async (userId, payload) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!existingUser) {
    throw new AppError_default(es_default.NOT_FOUND, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name ?? existingUser.name,
      phone: payload.phone ?? existingUser.phone,
      image: payload.image ?? existingUser.image,
      status: payload.status ?? existingUser.status,
      isActive: payload.isActive ?? existingUser.isActive,
      ...payload.providerProfile && { providerProfile: payload.providerProfile }
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      isSubscribed: true,
      image: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  const addressData = payload.addresses;
  if (addressData?.length) {
    await prisma.address.deleteMany({
      where: { userId }
    });
    await prisma.address.createMany({
      data: addressData.map((address) => ({
        userId,
        label: address.label ?? null,
        fullAddress: address.fullAddress,
        lat: address.lat ?? null,
        lng: address.lng ?? null,
        phone: address.phone ?? null
      }))
    });
  }
  return updatedUser;
};
var getSingleUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      isSubscribed: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return user;
};
var updateUser = async (userId, payload) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.role !== void 0 && { role: payload.role },
      ...payload.emailVerified !== void 0 && {
        emailVerified: payload.emailVerified
      },
      ...payload.status !== void 0 && { status: payload.status },
      ...payload.phone !== void 0 && { phone: payload.phone }
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      isSubscribed: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updatedUser;
};
var createAddress = async (userId, payload) => {
  if (!payload?.fullAddress?.trim()) {
    throw new AppError_default(es_default.BAD_REQUEST, "Full address is required");
  }
  const address = await prisma.address.create({
    data: {
      user: { connect: { id: userId } },
      label: payload.label ?? null,
      fullAddress: payload.fullAddress,
      lat: payload.lat ?? null,
      lng: payload.lng ?? null,
      phone: payload.phone ?? null
    }
  });
  return address;
};
var getMyAddresses = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
};
var updateAddress = async (userId, addressId, payload) => {
  if (!addressId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Address ID is required");
  }
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
    select: { id: true }
  });
  if (!existing) {
    throw new AppError_default(es_default.NOT_FOUND, "Address not found");
  }
  if (payload.label === void 0 && payload.fullAddress === void 0 && payload.lat === void 0 && payload.lng === void 0 && payload.phone === void 0) {
    throw new AppError_default(es_default.BAD_REQUEST, "No address fields to update");
  }
  return prisma.address.update({
    where: { id: addressId },
    data: {
      ...payload.label !== void 0 && { label: payload.label },
      ...payload.fullAddress !== void 0 && {
        fullAddress: payload.fullAddress
      },
      ...payload.lat !== void 0 && { lat: payload.lat },
      ...payload.lng !== void 0 && { lng: payload.lng },
      ...payload.phone !== void 0 && { phone: payload.phone }
    }
  });
};
var deleteAddress = async (userId, addressId) => {
  if (!addressId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Address ID is required");
  }
  const existing = await prisma.address.findFirst({
    where: { id: addressId, userId },
    select: { id: true }
  });
  if (!existing) {
    throw new AppError_default(es_default.NOT_FOUND, "Address not found");
  }
  await prisma.address.delete({
    where: { id: addressId }
  });
  return { id: addressId };
};
var UserServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  getMe,
  updateMe,
  createAddress,
  getMyAddresses,
  updateAddress,
  deleteAddress
};

// src/app/modules/user/user.controller.ts
var getAllUsers2 = catchAsync(
  async (req, res, next) => {
    const query = req.query;
    try {
      const users = await UserServices.getAllUsers(
        query
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "All Users Retrieved Successfully",
        data: users.data,
        meta: users.meta
      });
    } catch (error) {
      throw new AppError_default(
        es_default.INTERNAL_SERVER_ERROR,
        "Something went wrong while retrieving users"
      );
    }
  }
);
var getMe2 = catchAsync(
  async (req, res, next) => {
    const decodedHeader = req.user;
    if (!decodedHeader) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    try {
      const user = await UserServices.getMe(
        req.headers
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Your profile Retrieved Successfully",
        data: user
      });
    } catch (error) {
      throw new AppError_default(
        es_default.INTERNAL_SERVER_ERROR,
        "Something went wrong while retrieving your profile"
      );
    }
  }
);
var updateMe2 = catchAsync(
  async (req, res, next) => {
    const {
      name,
      phone,
      image,
      status: bodyStatus,
      isActive,
      addresses,
      providerProfile
    } = req.body;
    const status = bodyStatus == "deleted" ? bodyStatus : null;
    const decodedHeader = req.user;
    if (!decodedHeader) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    try {
      const updatedUser = await UserServices.updateMe(
        decodedHeader.id,
        { name, phone, image, status, isActive, addresses, providerProfile }
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Your profile Updated Successfully",
        data: updatedUser
      });
    } catch (error) {
      throw new AppError_default(
        es_default.INTERNAL_SERVER_ERROR,
        "Something went wrong while updating your profile"
      );
    }
  }
);
var getSingleUser2 = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "User ID is required from params"
      );
    }
    try {
      const user = await UserServices.getSingleUser(id);
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "User Retrieved Successfully",
        data: user
      });
    } catch (error) {
      throw new AppError_default(
        es_default.INTERNAL_SERVER_ERROR,
        "Something went wrong while retrieving the user"
      );
    }
  }
);
var updateUser2 = catchAsync(
  async (req, res, next) => {
    const userId = req.params.id;
    const { name, role, emailVerified, status, phone } = req.body;
    if (!userId) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "User ID is required from params"
      );
    }
    try {
      const user = await UserServices.updateUser(userId, {
        name,
        role,
        emailVerified,
        status,
        phone
      });
      if (!user) {
        return next(new AppError_default(es_default.NOT_FOUND, "User not found"));
      }
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "User Data Updated Successfully",
        data: user
      });
    } catch (error) {
      throw new AppError_default(
        es_default.INTERNAL_SERVER_ERROR,
        "Something went wrong while updating the user data"
      );
    }
  }
);
var UserControllers = {
  getAllUsers: getAllUsers2,
  updateMe: updateMe2,
  getSingleUser: getSingleUser2,
  getMe: getMe2,
  updateUser: updateUser2,
  createAddress: catchAsync(
    async (req, res, next) => {
      const decodedHeader = req.user;
      if (!decodedHeader) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const address = await UserServices.createAddress(
        decodedHeader.id,
        req.body
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.CREATED,
        message: "Address created successfully",
        data: address
      });
    }
  ),
  getMyAddresses: catchAsync(
    async (req, res, next) => {
      const decodedHeader = req.user;
      if (!decodedHeader) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const addresses = await UserServices.getMyAddresses(
        decodedHeader.id
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Addresses retrieved successfully",
        data: addresses
      });
    }
  ),
  updateAddress: catchAsync(
    async (req, res, next) => {
      const decodedHeader = req.user;
      if (!decodedHeader) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const address = await UserServices.updateAddress(
        decodedHeader.id,
        req.params.id,
        req.body
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Address updated successfully",
        data: address
      });
    }
  ),
  deleteAddress: catchAsync(
    async (req, res, next) => {
      const decodedHeader = req.user;
      if (!decodedHeader) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const result = await UserServices.deleteAddress(
        decodedHeader.id,
        req.params.id
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Address deleted successfully",
        data: result
      });
    }
  )
};

// src/app/middlewares/checkRole.ts
var checkRole = (...authRoles) => async (req, res, next) => {
  const role = req.user?.role;
  if (!role) {
    throw new AppError_default(
      es_default.UNAUTHORIZED,
      "User role or user not found"
    );
  }
  try {
    if (!authRoles.includes(role)) {
      throw new AppError_default(
        es_default.FORBIDDEN,
        "You do not have permission to access this resource"
      );
    }
    next();
  } catch (error) {
    console.log("Role check error", error);
    next(error);
  }
};

// src/app/modules/user/user.route.ts
var router = Router();
router.get("/", checkAuth("admin" /* admin */), UserControllers.getAllUsers);
router.get(
  "/profile/:id",
  checkAuth("admin" /* admin */),
  UserControllers.getSingleUser
);
router.put(
  "/update-profile/:id",
  checkAuth("admin" /* admin */),
  UserControllers.updateUser
);
router.get(
  "/profile",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.getMe
);
router.patch(
  "/profile",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.updateMe
);
router.post(
  "/addresses",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.createAddress
);
router.get(
  "/addresses",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.getMyAddresses
);
router.patch(
  "/addresses/:id",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.updateAddress
);
router.delete(
  "/addresses/:id",
  checkAuth(...Object.values(Role)),
  checkRole(...Object.values(Role)),
  UserControllers.deleteAddress
);
var UserRoutes = router;

// src/app/modules/provider/provider.route.ts
import { Router as Router2 } from "express";

// src/app/modules/provider/provider.service.ts
var slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
var getProviderProfileOrThrow = async (userId) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!providerProfile) {
    throw new AppError_default(
      es_default.NOT_FOUND,
      "Provider profile not found. Please create a profile first."
    );
  }
  return providerProfile;
};
var ensureProviderRole = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true }
  });
  if (!user) {
    throw new AppError_default(es_default.NOT_FOUND, "User not found");
  }
  if (user.role !== "provider") {
    throw new AppError_default(
      es_default.FORBIDDEN,
      "Only providers can access this resource"
    );
  }
  return user;
};
var createProviderProfile = async (userId, payload) => {
  await ensureProviderRole(userId);
  if (!payload?.name?.trim()) {
    throw new AppError_default(es_default.BAD_REQUEST, "Provider name is required");
  }
  const existing = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (existing) {
    throw new AppError_default(es_default.CONFLICT, "Provider profile already exists");
  }
  const profile = await prisma.providerProfile.create({
    data: {
      user: { connect: { id: userId } },
      name: payload.name.trim(),
      description: payload.description,
      address: payload.address,
      phone: payload.phone,
      website: payload.website,
      logoSrc: payload.logoSrc
    }
  });
  return profile;
};
var updateProviderProfile = async (userId, payload) => {
  await ensureProviderRole(userId);
  const existing = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!existing) {
    throw new AppError_default(
      es_default.NOT_FOUND,
      "Provider profile not found. Please create a profile first."
    );
  }
  const profile = await prisma.providerProfile.update({
    where: { userId },
    data: {
      ...payload.name !== void 0 && { name: payload.name },
      ...payload.description !== void 0 && {
        description: payload.description
      },
      ...payload.address !== void 0 && { address: payload.address },
      ...payload.phone !== void 0 && { phone: payload.phone },
      ...payload.website !== void 0 && { website: payload.website },
      ...payload.logoSrc !== void 0 && { logoSrc: payload.logoSrc }
    }
  });
  return profile;
};
var ensureValidPrice = (price) => {
  const value = Number(price);
  if (!Number.isFinite(value) || value <= 0) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Price must be a valid positive number"
    );
  }
};
var ensureValidStock = (stock) => {
  if (stock === void 0 || stock === null) return;
  const value = Number(stock);
  if (!Number.isInteger(value) || value < 0) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Stock must be a non-negative integer"
    );
  }
};
var parseBoolean = (value) => {
  if (value === void 0) return void 0;
  if (value === "true") return true;
  if (value === "false") return false;
  return void 0;
};
var ensureValidPriceDelta = (priceDelta) => {
  if (priceDelta === void 0 || priceDelta === null) return;
  const value = Number(priceDelta);
  if (!Number.isFinite(value)) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Variant option price delta must be a valid number"
    );
  }
};
var normalizeImages = (images) => {
  if (!images?.length) return void 0;
  const primaryCount = images.filter((img) => img.isPrimary).length;
  if (primaryCount > 1) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Only one meal image can be primary"
    );
  }
  return images.map((img, index) => {
    if (!img?.src?.trim()) {
      throw new AppError_default(es_default.BAD_REQUEST, "Meal image src is required");
    }
    return {
      src: img.src,
      publicId: img.publicId,
      altText: img.altText,
      isPrimary: img.isPrimary ?? (primaryCount === 0 && index === 0)
    };
  });
};
var normalizeVariants = (variants) => {
  if (!variants?.length) return void 0;
  return variants.map((variant) => {
    if (!variant?.name?.trim()) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Meal variant name is required"
      );
    }
    const options = variant.options ?? [];
    const defaultCount = options.filter((opt) => opt.isDefault).length;
    if (defaultCount > 1) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Only one default option is allowed per variant"
      );
    }
    const optionCreates = options.map((option) => {
      if (!option?.title?.trim()) {
        throw new AppError_default(
          es_default.BAD_REQUEST,
          "Meal variant option title is required"
        );
      }
      ensureValidPriceDelta(option.priceDelta);
      return {
        title: option.title,
        priceDelta: option.priceDelta ?? 0,
        isDefault: option.isDefault ?? false
      };
    });
    const createInput = {
      name: variant.name,
      isRequired: variant.isRequired ?? false,
      ...optionCreates.length > 0 && { options: { create: optionCreates } }
    };
    return createInput;
  });
};
var normalizeCategories = (categories, categoryIds) => {
  const idSet = /* @__PURE__ */ new Set();
  const slugSet = /* @__PURE__ */ new Set();
  (categoryIds ?? []).forEach((id) => {
    if (id) idSet.add(id);
  });
  (categories ?? []).forEach((category) => {
    if (category?.id) {
      idSet.add(category.id);
      return;
    }
    const rawSlug = category?.slug ?? category?.name;
    if (!rawSlug) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Category name or slug is required"
      );
    }
    const slug = slugify(rawSlug);
    if (!slug) {
      throw new AppError_default(es_default.BAD_REQUEST, "Category slug is invalid");
    }
    slugSet.add(slug);
  });
  return {
    categoryIdsToLink: Array.from(idSet),
    categorySlugsToLink: Array.from(slugSet)
  };
};
var resolveActiveCategoryIds = async (categoryIds, categorySlugs) => {
  if (!categoryIds.length && !categorySlugs.length) {
    return [];
  }
  const or = [];
  if (categoryIds.length) {
    or.push({ id: { in: categoryIds } });
  }
  if (categorySlugs.length) {
    or.push({ slug: { in: categorySlugs } });
  }
  const categories = await prisma.category.findMany({
    where: {
      status: "active",
      OR: or
    },
    select: { id: true, slug: true }
  });
  const foundIds = new Set(categories.map((category) => category.id));
  const foundSlugs = new Set(categories.map((category) => category.slug));
  categoryIds.forEach((id) => {
    if (!foundIds.has(id)) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Category not found or not approved"
      );
    }
  });
  categorySlugs.forEach((slug) => {
    if (!foundSlugs.has(slug)) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Category not found or not approved"
      );
    }
  });
  return categories.map((category) => category.id);
};
var normalizeDietaryPreferences = (preferences, preferenceIds) => {
  const idSet = /* @__PURE__ */ new Set();
  const slugMap = /* @__PURE__ */ new Map();
  (preferenceIds ?? []).forEach((id) => {
    if (id) idSet.add(id);
  });
  (preferences ?? []).forEach((pref) => {
    if (pref?.id) {
      idSet.add(pref.id);
      return;
    }
    const rawSlug = pref?.slug ?? pref?.name;
    if (!rawSlug) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Dietary preference name or slug is required"
      );
    }
    const slug = slugify(rawSlug);
    if (!slug) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Dietary preference slug is invalid"
      );
    }
    const name = pref?.name?.trim() || pref?.slug?.trim() || slug;
    slugMap.set(slug, { name, slug });
  });
  const dietaryTagCreates = [];
  idSet.forEach((id) => {
    dietaryTagCreates.push({
      dietaryPreference: { connect: { id } }
    });
  });
  slugMap.forEach((pref) => {
    dietaryTagCreates.push({
      dietaryPreference: {
        connectOrCreate: {
          where: { slug: pref.slug },
          create: pref
        }
      }
    });
  });
  return {
    dietaryTagCreates,
    dietaryPreferenceIdsToLink: Array.from(idSet),
    dietaryPreferenceSlugsToLink: Array.from(slugMap.keys())
  };
};
var ensureDietaryPreferenceIdsExist = async (preferenceIds) => {
  if (!preferenceIds.length) return;
  const existing = await prisma.dietaryPreference.findMany({
    where: { id: { in: preferenceIds } },
    select: { id: true }
  });
  if (existing.length !== preferenceIds.length) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "One or more dietary preference IDs are invalid"
    );
  }
};
var addMeal = async (userId, payload) => {
  if (!payload?.title?.trim()) {
    throw new AppError_default(es_default.BAD_REQUEST, "Meal title is required");
  }
  if (payload.price === void 0 || payload.price === null) {
    throw new AppError_default(es_default.BAD_REQUEST, "Meal price is required");
  }
  ensureValidPrice(payload.price);
  ensureValidStock(payload.stock);
  const providerProfile = await getProviderProfileOrThrow(userId);
  const rawSlug = payload.slug ?? payload.title;
  const slug = slugify(rawSlug);
  if (!slug) {
    throw new AppError_default(es_default.BAD_REQUEST, "Meal slug is invalid");
  }
  const existingSlug = await prisma.meal.findFirst({
    where: {
      providerProfileId: providerProfile.id,
      slug
    },
    select: { id: true }
  });
  if (existingSlug) {
    throw new AppError_default(
      es_default.CONFLICT,
      "A meal with this slug already exists"
    );
  }
  const normalizedImages = normalizeImages(payload.images);
  const normalizedVariants = normalizeVariants(payload.variants);
  const { categoryIdsToLink, categorySlugsToLink } = normalizeCategories(
    payload.categories,
    payload.categoryIds
  );
  const {
    dietaryTagCreates,
    dietaryPreferenceIdsToLink,
    dietaryPreferenceSlugsToLink
  } = normalizeDietaryPreferences(
    payload.dietaryPreferences,
    payload.dietaryPreferenceIds
  );
  const resolvedCategoryIds = await resolveActiveCategoryIds(
    categoryIdsToLink,
    categorySlugsToLink
  );
  await ensureDietaryPreferenceIdsExist(dietaryPreferenceIdsToLink);
  const data = {
    title: payload.title,
    slug,
    description: payload.description,
    shortDesc: payload.shortDesc,
    price: payload.price,
    currency: payload.currency,
    stock: payload.stock,
    isActive: payload.isActive ?? true,
    isFeatured: payload.isFeatured ?? false,
    providerProfile: {
      connect: { id: providerProfile.id }
    },
    ...normalizedImages && { images: { create: normalizedImages } },
    ...normalizedVariants && { variants: { create: normalizedVariants } },
    ...resolvedCategoryIds.length > 0 && {
      categories: {
        create: resolvedCategoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } }
        }))
      }
    },
    ...dietaryTagCreates.length > 0 && {
      dietaryTags: { create: dietaryTagCreates }
    }
  };
  const meal = await prisma.meal.create({ data });
  if (resolvedCategoryIds.length > 0) {
    await prisma.providerCategory.createMany({
      data: resolvedCategoryIds.map((categoryId) => ({
        providerProfileId: providerProfile.id,
        categoryId
      })),
      skipDuplicates: true
    });
  }
  return meal;
};
var updateMeal = async (userId, mealId, payload) => {
  if (!mealId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Meal ID is required");
  }
  if (payload.price !== void 0) {
    ensureValidPrice(payload.price);
  }
  if (payload.stock !== void 0) {
    ensureValidStock(payload.stock);
  }
  const providerProfile = await getProviderProfileOrThrow(userId);
  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerProfileId: providerProfile.id,
      deletedAt: null
    },
    select: { id: true, slug: true }
  });
  if (!existingMeal) {
    throw new AppError_default(es_default.NOT_FOUND, "Meal not found");
  }
  const hasCategoryUpdate = payload.categoryIds !== void 0 || payload.categories !== void 0;
  const hasImageUpdate = payload.images !== void 0;
  const hasVariantUpdate = payload.variants !== void 0;
  let slug;
  if (payload.slug !== void 0) {
    slug = slugify(payload.slug);
    if (!slug) {
      throw new AppError_default(es_default.BAD_REQUEST, "Meal slug is invalid");
    }
  }
  if (slug && slug !== existingMeal.slug) {
    const slugExists = await prisma.meal.findFirst({
      where: {
        providerProfileId: providerProfile.id,
        slug,
        id: { not: mealId }
      },
      select: { id: true }
    });
    if (slugExists) {
      throw new AppError_default(
        es_default.CONFLICT,
        "A meal with this slug already exists"
      );
    }
  }
  const normalizedImages = hasImageUpdate ? payload.images?.length ? normalizeImages(payload.images) : [] : void 0;
  const normalizedVariants = hasVariantUpdate ? payload.variants?.length ? normalizeVariants(payload.variants) : [] : void 0;
  const { categoryIdsToLink, categorySlugsToLink } = hasCategoryUpdate ? normalizeCategories(payload.categories, payload.categoryIds) : {
    categoryIdsToLink: [],
    categorySlugsToLink: []
  };
  const hasDietaryUpdate = payload.dietaryPreferenceIds !== void 0 || payload.dietaryPreferences !== void 0;
  const {
    dietaryTagCreates,
    dietaryPreferenceIdsToLink,
    dietaryPreferenceSlugsToLink
  } = hasDietaryUpdate ? normalizeDietaryPreferences(
    payload.dietaryPreferences,
    payload.dietaryPreferenceIds
  ) : {
    dietaryTagCreates: [],
    dietaryPreferenceIdsToLink: [],
    dietaryPreferenceSlugsToLink: []
  };
  const resolvedCategoryIds = hasCategoryUpdate ? await resolveActiveCategoryIds(categoryIdsToLink, categorySlugsToLink) : [];
  if (hasDietaryUpdate) {
    await ensureDietaryPreferenceIdsExist(dietaryPreferenceIdsToLink);
  }
  const data = {
    ...payload.title !== void 0 && { title: payload.title },
    ...payload.description !== void 0 && {
      description: payload.description
    },
    ...payload.shortDesc !== void 0 && { shortDesc: payload.shortDesc },
    ...payload.price !== void 0 && { price: payload.price },
    ...payload.currency !== void 0 && { currency: payload.currency },
    ...payload.stock !== void 0 && { stock: payload.stock },
    ...payload.isActive !== void 0 && { isActive: payload.isActive },
    ...payload.isFeatured !== void 0 && { isFeatured: payload.isFeatured },
    ...slug !== void 0 && { slug }
  };
  if (hasImageUpdate) {
    data.images = {
      deleteMany: {},
      ...normalizedImages && normalizedImages.length > 0 ? { create: normalizedImages } : {}
    };
  }
  if (hasVariantUpdate) {
    data.variants = {
      deleteMany: {},
      ...normalizedVariants && normalizedVariants.length > 0 ? { create: normalizedVariants } : {}
    };
  }
  if (hasCategoryUpdate) {
    data.categories = {
      deleteMany: {},
      ...resolvedCategoryIds.length > 0 ? {
        create: resolvedCategoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } }
        }))
      } : {}
    };
  }
  if (hasDietaryUpdate) {
    data.dietaryTags = {
      deleteMany: {},
      ...dietaryTagCreates.length > 0 ? { create: dietaryTagCreates } : {}
    };
  }
  if (Object.keys(data).length === 0) {
    throw new AppError_default(es_default.BAD_REQUEST, "No meal fields to update");
  }
  const meal = await prisma.meal.update({
    where: { id: mealId },
    data
  });
  if (hasCategoryUpdate && resolvedCategoryIds.length > 0) {
    await prisma.providerCategory.createMany({
      data: resolvedCategoryIds.map((categoryId) => ({
        providerProfileId: providerProfile.id,
        categoryId
      })),
      skipDuplicates: true
    });
  }
  return meal;
};
var removeMeal = async (userId, mealId) => {
  if (!mealId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Meal ID is required");
  }
  const providerProfile = await getProviderProfileOrThrow(userId);
  const existingMeal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      providerProfileId: providerProfile.id,
      deletedAt: null
    },
    select: { id: true }
  });
  if (!existingMeal) {
    throw new AppError_default(es_default.NOT_FOUND, "Meal not found");
  }
  const meal = await prisma.meal.update({
    where: { id: mealId },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      isActive: false
    }
  });
  return meal;
};
var updateOrderStatus = async (userId, orderId, payload) => {
  if (!orderId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Order ID is required");
  }
  if (!payload?.status) {
    throw new AppError_default(es_default.BAD_REQUEST, "Order status is required");
  }
  const providerProfile = await getProviderProfileOrThrow(userId);
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      providerProfileId: providerProfile.id
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!order) {
    throw new AppError_default(es_default.NOT_FOUND, "Order not found");
  }
  const allowedStatuses = [
    "preparing",
    "ready",
    "delivered"
  ];
  if (!allowedStatuses.includes(payload.status)) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Invalid status for provider update"
    );
  }
  const transitions = {
    placed: ["preparing"],
    preparing: ["ready"],
    ready: ["delivered"],
    delivered: [],
    cancelled: []
  };
  const possibleNext = transitions[order.status];
  if (!possibleNext.includes(payload.status)) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      `Cannot change status from ${order.status} to ${payload.status}`
    );
  }
  const now = /* @__PURE__ */ new Date();
  const timestampUpdates = {
    ...payload.status === "preparing" && { preparedAt: now },
    ...payload.status === "ready" && { readyAt: now },
    ...payload.status === "delivered" && { deliveredAt: now }
  };
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: payload.status,
      ...timestampUpdates
    }
  });
  return updatedOrder;
};
var getAllProviders = async (query) => {
  const { categoryId, isVerified } = query;
  const qb = new QueryBuilder(query).search(["name", "description", "address"]).filter().sort().paginate();
  const built = qb.build();
  const verifiedFilter = parseBoolean(isVerified);
  built.where.isVerified = verifiedFilter ?? true;
  if (categoryId) {
    built.where.categories = {
      some: { categoryId }
    };
  }
  const findQuery = {
    ...built,
    include: {
      categories: { include: { category: true } }
    }
  };
  const [total, providers] = await Promise.all([
    prisma.providerProfile.count({ where: built.where }),
    prisma.providerProfile.findMany(findQuery)
  ]);
  const pageNumber = Number(query.page) || 1;
  const limitNumber = Number(query.limit) || 10;
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: providers
  };
};
var getProviderWithMenu = async (providerId) => {
  if (!providerId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Provider ID is required");
  }
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    include: {
      categories: {
        include: { category: true }
      },
      meals: {
        where: {
          deletedAt: null,
          isActive: true
        },
        include: {
          images: {
            where: { isPrimary: true }
          },
          categories: {
            include: { category: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!provider || !provider.isVerified) {
    throw new AppError_default(es_default.NOT_FOUND, "Provider not found");
  }
  return provider;
};
var createCategoryRequest = async (userId, payload) => {
  await ensureProviderRole(userId);
  if (!payload?.name?.trim()) {
    throw new AppError_default(es_default.BAD_REQUEST, "Category name is required");
  }
  const slug = slugify(payload.slug ?? payload.name);
  if (!slug) {
    throw new AppError_default(es_default.BAD_REQUEST, "Category slug is invalid");
  }
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: payload.name.trim() }, { slug }]
    },
    select: { id: true, status: true }
  });
  if (existing) {
    throw new AppError_default(
      es_default.CONFLICT,
      "Category already exists or pending approval"
    );
  }
  return prisma.category.create({
    data: {
      name: payload.name.trim(),
      slug,
      description: payload.description,
      status: "pending",
      createdBy: { connect: { id: userId } }
    }
  });
};
var getMyCategories = async (userId, query) => {
  await ensureProviderRole(userId);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = query.status;
  if (status && !["active", "pending", "rejected"].includes(status)) {
    throw new AppError_default(es_default.BAD_REQUEST, "Invalid category status");
  }
  const where = {
    createdByUserId: userId,
    ...status ? { status } : {}
  };
  const [total, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: categories
  };
};
var getMyOrders = async (userId, query) => {
  const providerProfile = await getProviderProfileOrThrow(userId);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = query.status;
  const where = {
    providerProfileId: providerProfile.id,
    ...status && { status }
  };
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { placedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        address: true,
        items: {
          include: {
            meal: {
              select: {
                id: true,
                title: true,
                price: true
              }
            },
            options: {
              include: {
                variantOption: true
              }
            }
          }
        }
      }
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: orders
  };
};
var ProviderServices = {
  getProviderWithMenu,
  getAllProviders,
  getMyOrders,
  createCategoryRequest,
  getMyCategories,
  createProviderProfile,
  updateProviderProfile,
  addMeal,
  updateMeal,
  removeMeal,
  updateOrderStatus
};

// src/app/modules/provider/provider.controller.ts
var addMeal2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const meal = await ProviderServices.addMeal(
      userId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.CREATED,
      message: "Meal added successfully",
      data: meal
    });
  }
);
var updateMeal2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const mealId = req.params.id;
    const meal = await ProviderServices.updateMeal(
      userId,
      mealId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Meal updated successfully",
      data: meal
    });
  }
);
var removeMeal2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const mealId = req.params.id;
    const meal = await ProviderServices.removeMeal(userId, mealId);
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Meal removed successfully",
      data: meal
    });
  }
);
var updateOrderStatus2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const orderId = req.params.id;
    const updatedOrder = await ProviderServices.updateOrderStatus(
      userId,
      orderId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Order status updated successfully",
      data: updatedOrder
    });
  }
);
var ProviderControllers = {
  getAllProviders: catchAsync(
    async (req, res, next) => {
      const providers = await ProviderServices.getAllProviders(
        req.query
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Providers retrieved successfully",
        data: providers.data,
        meta: providers.meta
      });
    }
  ),
  getProviderWithMenu: catchAsync(
    async (req, res, next) => {
      const provider = await ProviderServices.getProviderWithMenu(
        req.params.id
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Provider retrieved successfully",
        data: provider
      });
    }
  ),
  getMyOrders: catchAsync(
    async (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const orders = await ProviderServices.getMyOrders(
        userId,
        req.query
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Orders retrieved successfully",
        data: orders.data,
        meta: orders.meta
      });
    }
  ),
  getMyCategories: catchAsync(
    async (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const categories = await ProviderServices.getMyCategories(
        userId,
        req.query
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Categories retrieved successfully",
        data: categories.data,
        meta: categories.meta
      });
    }
  ),
  createCategoryRequest: catchAsync(
    async (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const category = await ProviderServices.createCategoryRequest(
        userId,
        req.body
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.CREATED,
        message: "Category request submitted",
        data: category
      });
    }
  ),
  createProviderProfile: catchAsync(
    async (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const profile = await ProviderServices.createProviderProfile(
        userId,
        req.body
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.CREATED,
        message: "Provider profile created successfully",
        data: profile
      });
    }
  ),
  updateProviderProfile: catchAsync(
    async (req, res, next) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
      }
      const profile = await ProviderServices.updateProviderProfile(
        userId,
        req.body
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Provider profile updated successfully",
        data: profile
      });
    }
  ),
  addMeal: addMeal2,
  updateMeal: updateMeal2,
  removeMeal: removeMeal2,
  updateOrderStatus: updateOrderStatus2
};

// src/app/modules/provider/provider.route.ts
var router2 = Router2();
router2.post(
  "/profile",
  checkAuth("provider" /* provider */),
  ProviderControllers.createProviderProfile
);
router2.patch(
  "/profile",
  checkAuth("provider" /* provider */),
  ProviderControllers.updateProviderProfile
);
router2.get(
  "/orders",
  checkAuth("provider" /* provider */),
  ProviderControllers.getMyOrders
);
router2.get(
  "/categories",
  checkAuth("provider" /* provider */),
  ProviderControllers.getMyCategories
);
router2.post(
  "/categories",
  checkAuth("provider" /* provider */),
  ProviderControllers.createCategoryRequest
);
router2.post("/meals", checkAuth("provider" /* provider */), ProviderControllers.addMeal);
router2.put(
  "/meals/:id",
  checkAuth("provider" /* provider */),
  ProviderControllers.updateMeal
);
router2.delete(
  "/meals/:id",
  checkAuth("provider" /* provider */),
  ProviderControllers.removeMeal
);
router2.patch(
  "/orders/:id",
  checkAuth("provider" /* provider */),
  ProviderControllers.updateOrderStatus
);
var ProviderRoutes = router2;

// src/app/modules/provider/provider.public.route.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/", ProviderControllers.getAllProviders);
router3.get("/:id", ProviderControllers.getProviderWithMenu);
var ProviderPublicRoutes = router3;

// src/app/modules/meal/meal.route.ts
import { Router as Router4 } from "express";

// src/app/modules/meal/meal.service.ts
var parseBoolean2 = (value) => {
  if (value === void 0) return void 0;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return void 0;
};
var parseNumber = (value) => {
  if (value === void 0) return void 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : void 0;
};
var parsePagination = (page, limit) => {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  return {
    page: pageNumber,
    limit: limitNumber,
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber
  };
};
var buildMealQuery = (query) => {
  const qbQuery = {
    searchTerm: query.searchTerm,
    sort: query.sort,
    page: query.page,
    limit: query.limit
  };
  const providerFilter = query.providerProfileId || query.providerId;
  if (providerFilter) {
    qbQuery.providerProfileId = providerFilter;
  }
  const qb = new QueryBuilder(qbQuery).filter().search(["title", "description", "shortDesc"]).sort().paginate();
  const built = qb.build();
  const where = {
    ...built.where ?? {},
    deletedAt: null
  };
  const active = parseBoolean2(query.isActive);
  where.isActive = active ?? true;
  const featured = parseBoolean2(query.isFeatured);
  if (featured !== void 0) {
    where.isFeatured = featured;
  }
  if (query.categoryId) {
    where.categories = {
      some: {
        categoryId: query.categoryId
      }
    };
  }
  const min = parseNumber(query.minPrice);
  const max = parseNumber(query.maxPrice);
  if (min !== void 0 || max !== void 0) {
    where.price = {
      ...min !== void 0 && { gte: min },
      ...max !== void 0 && { lte: max }
    };
  }
  return {
    where,
    orderBy: built.orderBy,
    skip: built.skip,
    take: built.take
  };
};
var getAllMeals = async (query) => {
  const { where, orderBy, skip, take } = buildMealQuery(query);
  const { page, limit } = parsePagination(query.page, query.limit);
  const [total, meals] = await Promise.all([
    prisma.meal.count({ where }),
    prisma.meal.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        providerProfile: {
          select: {
            id: true,
            name: true,
            logoSrc: true,
            rating: true,
            isVerified: true
          }
        },
        images: {
          where: { isPrimary: true },
          select: {
            id: true,
            src: true,
            altText: true,
            isPrimary: true
          }
        },
        categories: {
          include: {
            category: true
          }
        }
      }
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: meals
  };
};
var getMealById = async (mealId) => {
  if (!mealId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Meal ID is required");
  }
  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
      deletedAt: null,
      isActive: true
    },
    include: {
      providerProfile: {
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          phone: true,
          website: true,
          logoSrc: true,
          rating: true,
          isVerified: true
        }
      },
      images: true,
      variants: {
        include: {
          options: true
        }
      },
      categories: {
        include: {
          category: true
        }
      },
      dietaryTags: {
        include: {
          dietaryPreference: true
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      }
    }
  });
  if (!meal) {
    throw new AppError_default(es_default.NOT_FOUND, "Meal not found");
  }
  return meal;
};
var MealServices = {
  getAllMeals,
  getMealById
};

// src/app/modules/meal/meal.controller.ts
var getAllMeals2 = catchAsync(
  async (req, res, next) => {
    const meals = await MealServices.getAllMeals(
      req.query
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Meals retrieved successfully",
      data: meals.data,
      meta: meals.meta
    });
  }
);
var getMealById2 = catchAsync(
  async (req, res, next) => {
    const meal = await MealServices.getMealById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Meal retrieved successfully",
      data: meal
    });
  }
);
var MealControllers = {
  getAllMeals: getAllMeals2,
  getMealById: getMealById2
};

// src/app/modules/meal/meal.route.ts
var router4 = Router4();
router4.get("/", MealControllers.getAllMeals);
router4.get("/:id", MealControllers.getMealById);
var MealRoutes = router4;

// src/app/modules/order/order.route.ts
import { Router as Router5 } from "express";

// src/app/modules/order/order.service.ts
var ensureQuantity = (quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Order item quantity must be a positive integer"
    );
  }
};
var buildOrderFromCart = async (userId, providerProfileId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          meal: {
            select: {
              id: true,
              price: true,
              stock: true,
              currency: true,
              providerProfileId: true,
              deletedAt: true,
              isActive: true
            }
          },
          variantOption: {
            include: {
              variant: {
                select: { mealId: true }
              }
            }
          }
        }
      }
    }
  });
  if (!cart || cart.items.length === 0) {
    throw new AppError_default(es_default.BAD_REQUEST, "Cart is empty");
  }
  const quantityByMeal = /* @__PURE__ */ new Map();
  const mealsToDecrement = /* @__PURE__ */ new Map();
  const orderItems = [];
  let totalAmount = 0;
  let currency = null;
  cart.items.forEach((item) => {
    ensureQuantity(item.quantity);
    const meal = item.meal;
    if (!meal || meal.deletedAt || !meal.isActive) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "One or more meals in cart are unavailable"
      );
    }
    if (meal.providerProfileId !== providerProfileId) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Cart contains items from another provider"
      );
    }
    if (currency && currency !== meal.currency) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "All meals in an order must use the same currency"
      );
    }
    currency = meal.currency;
    let priceDelta = 0;
    const optionCreates = [];
    if (item.variantOptionId) {
      const option = item.variantOption;
      if (!option || option.variant.mealId !== meal.id) {
        throw new AppError_default(
          es_default.BAD_REQUEST,
          "Variant option does not belong to the meal"
        );
      }
      priceDelta = Number(option.priceDelta);
      optionCreates.push({
        variantOption: { connect: { id: option.id } },
        priceDelta
      });
    }
    const unitPrice = Number(meal.price) + priceDelta;
    const subtotal = unitPrice * item.quantity;
    totalAmount += subtotal;
    quantityByMeal.set(
      meal.id,
      (quantityByMeal.get(meal.id) ?? 0) + item.quantity
    );
    orderItems.push({
      meal: { connect: { id: meal.id } },
      quantity: item.quantity,
      unitPrice,
      subtotal,
      ...optionCreates.length > 0 && { options: { create: optionCreates } }
    });
  });
  quantityByMeal.forEach((qty, mealId) => {
    const meal = cart.items.find((item) => item.meal.id === mealId)?.meal;
    if (meal?.stock !== null && meal?.stock !== void 0) {
      if (meal.stock < qty) {
        throw new AppError_default(
          es_default.BAD_REQUEST,
          "Not enough stock for one or more meals"
        );
      }
      mealsToDecrement.set(mealId, qty);
    }
  });
  return {
    orderItems,
    totalAmount,
    currency: currency ?? "USD",
    mealsToDecrement,
    cartId: cart.id
  };
};
var createOrder = async (userId, payload) => {
  if (!payload.providerProfileId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Provider ID is required");
  }
  if (!payload.deliveryAddressId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Delivery address is required");
  }
  if (payload.paymentMethod && payload.paymentMethod !== "cash_on_delivery") {
    throw new AppError_default(es_default.BAD_REQUEST, "Only cash on delivery is allowed");
  }
  const provider = await prisma.providerProfile.findUnique({
    where: { id: payload.providerProfileId },
    select: { id: true }
  });
  if (!provider) {
    throw new AppError_default(es_default.NOT_FOUND, "Provider not found");
  }
  const address = await prisma.address.findFirst({
    where: {
      id: payload.deliveryAddressId,
      userId
    },
    select: { id: true }
  });
  if (!address) {
    throw new AppError_default(es_default.NOT_FOUND, "Delivery address not found");
  }
  const { orderItems, totalAmount, currency, mealsToDecrement, cartId } = await buildOrderFromCart(userId, payload.providerProfileId);
  const order = await prisma.$transaction(async (tx) => {
    for (const [mealId, qty] of mealsToDecrement.entries()) {
      await tx.meal.update({
        where: { id: mealId },
        data: {
          ...qty > 0 && { stock: { decrement: qty } }
        }
      });
    }
    const createdOrder = await tx.order.create({
      data: {
        user: { connect: { id: userId } },
        providerProfile: { connect: { id: payload.providerProfileId } },
        address: { connect: { id: payload.deliveryAddressId } },
        totalAmount,
        currency,
        paymentMethod: "cash_on_delivery",
        notes: payload.notes,
        items: { create: orderItems }
      },
      include: {
        items: {
          include: {
            meal: {
              select: {
                id: true,
                title: true,
                price: true
              }
            },
            options: {
              include: {
                variantOption: true
              }
            }
          }
        },
        providerProfile: {
          select: {
            id: true,
            name: true,
            logoSrc: true
          }
        },
        address: true
      }
    });
    await tx.cartItem.deleteMany({
      where: { cartId }
    });
    return createdOrder;
  });
  return order;
};
var getMyOrders2 = async (userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { placedAt: "desc" },
      include: {
        providerProfile: {
          select: {
            id: true,
            name: true,
            logoSrc: true
          }
        },
        items: {
          include: {
            meal: {
              select: {
                id: true,
                title: true,
                price: true
              }
            },
            options: {
              include: {
                variantOption: true
              }
            }
          }
        }
      }
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: orders
  };
};
var getOrderById = async (userId, orderId) => {
  if (!orderId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Order ID is required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    include: {
      providerProfile: {
        select: {
          id: true,
          name: true,
          logoSrc: true
        }
      },
      address: true,
      items: {
        include: {
          meal: {
            select: {
              id: true,
              title: true,
              price: true
            }
          },
          options: {
            include: {
              variantOption: true
            }
          }
        }
      },
      reviews: true
    }
  });
  if (!order) {
    throw new AppError_default(es_default.NOT_FOUND, "Order not found");
  }
  return order;
};
var cancelOrder = async (userId, orderId) => {
  if (!orderId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Order ID is required");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    include: {
      items: true
    }
  });
  if (!order) {
    throw new AppError_default(es_default.NOT_FOUND, "Order not found");
  }
  if (order.status !== "placed") {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Only placed orders can be cancelled"
    );
  }
  const orderItemMealIds = Array.from(
    new Set(order.items.map((item) => item.mealId))
  );
  const meals = await prisma.meal.findMany({
    where: { id: { in: orderItemMealIds } },
    select: { id: true, stock: true }
  });
  const stockByMealId = new Map(
    meals.map((meal) => [meal.id, meal.stock])
  );
  const quantityByMeal = /* @__PURE__ */ new Map();
  order.items.forEach((item) => {
    quantityByMeal.set(
      item.mealId,
      (quantityByMeal.get(item.mealId) ?? 0) + item.quantity
    );
  });
  const updatedOrder = await prisma.$transaction(async (tx) => {
    for (const [mealId, qty] of quantityByMeal.entries()) {
      const stock = stockByMealId.get(mealId);
      if (stock !== null && stock !== void 0) {
        await tx.meal.update({
          where: { id: mealId },
          data: { stock: { increment: qty } }
        });
      }
    }
    return tx.order.update({
      where: { id: orderId },
      data: {
        status: "cancelled",
        cancelledAt: /* @__PURE__ */ new Date()
      }
    });
  });
  return updatedOrder;
};
var OrderServices = {
  createOrder,
  getMyOrders: getMyOrders2,
  getOrderById,
  cancelOrder
};

// src/app/modules/order/order.controller.ts
var createOrder2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const order = await OrderServices.createOrder(
      userId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.CREATED,
      message: "Order placed successfully",
      data: order
    });
  }
);
var getMyOrders3 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const orders = await OrderServices.getMyOrders(
      userId,
      req.query
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Orders retrieved successfully",
      data: orders.data,
      meta: orders.meta
    });
  }
);
var getOrderById2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const order = await OrderServices.getOrderById(userId, req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Order retrieved successfully",
      data: order
    });
  }
);
var cancelOrder2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const order = await OrderServices.cancelOrder(userId, req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Order cancelled successfully",
      data: order
    });
  }
);
var OrderControllers = {
  createOrder: createOrder2,
  getMyOrders: getMyOrders3,
  getOrderById: getOrderById2,
  cancelOrder: cancelOrder2
};

// src/app/modules/order/order.route.ts
var router5 = Router5();
router5.get(
  "/",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  OrderControllers.getMyOrders
);
router5.post(
  "/",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  OrderControllers.createOrder
);
router5.get(
  "/:id",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  OrderControllers.getOrderById
);
router5.patch(
  "/cancel/:id",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  OrderControllers.cancelOrder
);
var OrderRoutes = router5;

// src/app/modules/cart/cart.route.ts
import { Router as Router6 } from "express";

// src/app/modules/cart/cart.service.ts
var ensureQuantity2 = (quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Quantity must be a positive integer"
    );
  }
};
var getOrCreateCart = async (userId) => {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });
};
var validateMealAndOption = async (mealId, variantOptionId) => {
  const meal = await prisma.meal.findFirst({
    where: { id: mealId, deletedAt: null, isActive: true },
    select: { id: true }
  });
  if (!meal) {
    throw new AppError_default(es_default.NOT_FOUND, "Meal not found");
  }
  if (variantOptionId) {
    const option = await prisma.mealVariantOption.findUnique({
      where: { id: variantOptionId },
      include: { variant: { select: { mealId: true } } }
    });
    if (!option || option.variant.mealId !== mealId) {
      throw new AppError_default(
        es_default.BAD_REQUEST,
        "Variant option does not belong to the meal"
      );
    }
  }
};
var getCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          meal: true,
          variantOption: {
            include: {
              variant: true
            }
          }
        }
      }
    }
  });
  return cart ?? {
    id: null,
    userId,
    items: []
  };
};
var addItem = async (userId, payload) => {
  if (!payload?.mealId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Meal ID is required");
  }
  const quantity = payload.quantity ?? 1;
  ensureQuantity2(quantity);
  const optionId = payload.variantOptionId ?? null;
  await validateMealAndOption(payload.mealId, optionId);
  const cart = await getOrCreateCart(userId);
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      mealId: payload.mealId,
      variantOptionId: optionId
      // keep null here to match "no option" items
    }
  });
  const include = {
    meal: true,
    variantOption: {
      include: { variant: true }
    }
  };
  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: { increment: quantity }
      },
      include
    });
  }
  return prisma.cartItem.create({
    data: {
      cart: { connect: { id: cart.id } },
      meal: { connect: { id: payload.mealId } },
      // ✅ only connect if optionId exists, otherwise omit the field
      ...optionId ? { variantOption: { connect: { id: optionId } } } : {},
      quantity
    },
    include
  });
};
var updateItem = async (userId, itemId, payload) => {
  if (!itemId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Cart item ID is required");
  }
  ensureQuantity2(payload.quantity);
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId }
    }
  });
  if (!item) {
    throw new AppError_default(es_default.NOT_FOUND, "Cart item not found");
  }
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: payload.quantity },
    include: {
      meal: true,
      variantOption: {
        include: {
          variant: true
        }
      }
    }
  });
};
var removeItem = async (userId, itemId) => {
  if (!itemId) {
    throw new AppError_default(es_default.BAD_REQUEST, "Cart item ID is required");
  }
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId }
    }
  });
  if (!item) {
    throw new AppError_default(es_default.NOT_FOUND, "Cart item not found");
  }
  await prisma.cartItem.delete({ where: { id: itemId } });
  return { id: itemId };
};
var clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    select: { id: true }
  });
  if (!cart) {
    return { cleared: true };
  }
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });
  return { cleared: true };
};
var CartServices = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
};

// src/app/modules/cart/cart.controller.ts
var getCart2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const cart = await CartServices.getCart(userId);
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Cart retrieved successfully",
      data: cart
    });
  }
);
var addItem2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const item = await CartServices.addItem(
      userId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.CREATED,
      message: "Item added to cart",
      data: item
    });
  }
);
var updateItem2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const item = await CartServices.updateItem(
      userId,
      req.params.id,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Cart item updated",
      data: item
    });
  }
);
var removeItem2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const result = await CartServices.removeItem(
      userId,
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Cart item removed",
      data: result
    });
  }
);
var clearCart2 = catchAsync(
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError_default(es_default.UNAUTHORIZED, "User not authenticated");
    }
    const result = await CartServices.clearCart(userId);
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Cart cleared",
      data: result
    });
  }
);
var CartControllers = {
  getCart: getCart2,
  addItem: addItem2,
  updateItem: updateItem2,
  removeItem: removeItem2,
  clearCart: clearCart2
};

// src/app/modules/cart/cart.route.ts
var router6 = Router6();
router6.get(
  "/",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  CartControllers.getCart
);
router6.post(
  "/items",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  CartControllers.addItem
);
router6.patch(
  "/items/:id",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  CartControllers.updateItem
);
router6.delete(
  "/items/:id",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  CartControllers.removeItem
);
router6.delete(
  "/clear",
  checkAuth("customer" /* customer */, "provider" /* provider */),
  CartControllers.clearCart
);
var CartRoutes = router6;

// src/app/modules/admin/admin.route.ts
import { Router as Router7 } from "express";

// src/app/modules/admin/admin.service.ts
var slugify2 = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
var getAllUsers3 = async (query) => {
  const { page, limit, searchTerm } = query;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const where = searchTerm && searchTerm.trim() ? {
    OR: [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
      { phone: { contains: searchTerm, mode: "insensitive" } }
    ]
  } : {};
  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    })
  ]);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: users
  };
};
var updateUserStatus = async (userId, payload) => {
  if (!userId) {
    throw new AppError_default(es_default.BAD_REQUEST, "User ID is required");
  }
  if (payload.status === void 0 && payload.isActive === void 0) {
    throw new AppError_default(
      es_default.BAD_REQUEST,
      "Status or active flag is required"
    );
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...payload.status !== void 0 && { status: payload.status },
      ...payload.isActive !== void 0 && { isActive: payload.isActive }
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var AdminServices = {
  getAllUsers: getAllUsers3,
  updateUserStatus,
  getAllOrders: async (query) => {
    const { page, limit, status, providerProfileId, userId, dateFrom, dateTo } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    const where = {
      ...status && { status },
      ...providerProfileId && { providerProfileId },
      ...userId && { userId }
    };
    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom) : void 0;
      const to = dateTo ? new Date(dateTo) : void 0;
      if (from && Number.isNaN(from.getTime()) || to && Number.isNaN(to.getTime())) {
        throw new AppError_default(es_default.BAD_REQUEST, "Invalid date range");
      }
      where.placedAt = {
        ...from && { gte: from },
        ...to && { lte: to }
      };
    }
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: { placedAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          providerProfile: {
            select: {
              id: true,
              name: true,
              logoSrc: true
            }
          },
          address: true,
          items: {
            include: {
              meal: {
                select: {
                  id: true,
                  title: true,
                  price: true
                }
              },
              options: {
                include: {
                  variantOption: true
                }
              }
            }
          }
        }
      })
    ]);
    return {
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPage: Math.ceil(total / limitNumber)
      },
      data: orders
    };
  },
  getAllCategories: async (query) => {
    const { page, limit, searchTerm, status } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;
    if (status && !["active", "pending", "rejected"].includes(status)) {
      throw new AppError_default(es_default.BAD_REQUEST, "Invalid category status");
    }
    const where = searchTerm && searchTerm.trim() ? {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { slug: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } }
      ]
    } : {};
    const [total, categories] = await Promise.all([
      prisma.category.count({
        where: {
          ...where,
          ...status ? { status } : {}
        }
      }),
      prisma.category.findMany({
        where: {
          ...where,
          ...status ? { status } : {}
        },
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" }
      })
    ]);
    return {
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPage: Math.ceil(total / limitNumber)
      },
      data: categories
    };
  },
  createCategory: async (payload, createdByUserId) => {
    if (!payload?.name?.trim()) {
      throw new AppError_default(es_default.BAD_REQUEST, "Category name is required");
    }
    const slug = slugify2(payload.slug ?? payload.name);
    if (!slug) {
      throw new AppError_default(es_default.BAD_REQUEST, "Category slug is invalid");
    }
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: payload.name }, { slug }]
      },
      select: { id: true }
    });
    if (existing) {
      throw new AppError_default(
        es_default.CONFLICT,
        "Category name or slug already exists"
      );
    }
    return prisma.category.create({
      data: {
        name: payload.name.trim(),
        slug,
        description: payload.description,
        status: "active",
        ...createdByUserId && {
          createdBy: { connect: { id: createdByUserId } }
        }
      }
    });
  },
  updateCategory: async (categoryId, payload) => {
    if (!categoryId) {
      throw new AppError_default(es_default.BAD_REQUEST, "Category ID is required");
    }
    if (payload.name === void 0 && payload.slug === void 0 && payload.description === void 0 && payload.status === void 0) {
      throw new AppError_default(es_default.BAD_REQUEST, "No category fields to update");
    }
    if (payload.name !== void 0 && !payload.name.trim()) {
      throw new AppError_default(es_default.BAD_REQUEST, "Category name is required");
    }
    if (payload.slug !== void 0) {
      const normalized = slugify2(payload.slug);
      if (!normalized) {
        throw new AppError_default(es_default.BAD_REQUEST, "Category slug is invalid");
      }
    }
    if (payload.status !== void 0 && !["active", "pending", "rejected"].includes(payload.status)) {
      throw new AppError_default(es_default.BAD_REQUEST, "Invalid category status");
    }
    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, slug: true, name: true }
    });
    if (!existing) {
      throw new AppError_default(es_default.NOT_FOUND, "Category not found");
    }
    if (payload.name || payload.slug) {
      const duplicate = await prisma.category.findFirst({
        where: {
          OR: [
            ...payload.name ? [{ name: payload.name }] : [],
            ...payload.slug ? [{ slug: slugify2(payload.slug) }] : []
          ],
          id: { not: categoryId }
        },
        select: { id: true }
      });
      if (duplicate) {
        throw new AppError_default(
          es_default.CONFLICT,
          "Category name or slug already exists"
        );
      }
    }
    return prisma.category.update({
      where: { id: categoryId },
      data: {
        ...payload.name !== void 0 && { name: payload.name },
        ...payload.slug !== void 0 && { slug: slugify2(payload.slug) },
        ...payload.description !== void 0 && {
          description: payload.description
        },
        ...payload.status !== void 0 && {
          status: payload.status
        }
      }
    });
  },
  deleteCategory: async (categoryId) => {
    if (!categoryId) {
      throw new AppError_default(es_default.BAD_REQUEST, "Category ID is required");
    }
    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true }
    });
    if (!existing) {
      throw new AppError_default(es_default.NOT_FOUND, "Category not found");
    }
    await prisma.category.delete({
      where: { id: categoryId }
    });
    return { id: categoryId };
  },
  verifyProvider: async (providerId, payload) => {
    if (!providerId) {
      throw new AppError_default(es_default.BAD_REQUEST, "Provider ID is required");
    }
    if (payload?.isVerified === void 0) {
      throw new AppError_default(es_default.BAD_REQUEST, "isVerified is required");
    }
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      select: { id: true }
    });
    if (!provider) {
      throw new AppError_default(es_default.NOT_FOUND, "Provider not found");
    }
    return prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        isVerified: payload.isVerified
      }
    });
  }
};

// src/app/modules/admin/admin.controller.ts
var getAllUsers4 = catchAsync(
  async (req, res, next) => {
    const users = await AdminServices.getAllUsers(
      req.query
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "Users retrieved successfully",
      data: users.data,
      meta: users.meta
    });
  }
);
var updateUserStatus2 = catchAsync(
  async (req, res, next) => {
    const userId = req.params.id;
    if (!userId) {
      throw new AppError_default(es_default.BAD_REQUEST, "User ID is required");
    }
    const user = await AdminServices.updateUserStatus(
      userId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: es_default.OK,
      message: "User status updated successfully",
      data: user
    });
  }
);
var AdminControllers = {
  getAllUsers: getAllUsers4,
  updateUserStatus: updateUserStatus2,
  getAllOrders: catchAsync(
    async (req, res, next) => {
      const orders = await AdminServices.getAllOrders(
        req.query
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Orders retrieved successfully",
        data: orders.data,
        meta: orders.meta
      });
    }
  ),
  getAllCategories: catchAsync(
    async (req, res, next) => {
      const categories = await AdminServices.getAllCategories(
        req.query
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Categories retrieved successfully",
        data: categories.data,
        meta: categories.meta
      });
    }
  ),
  createCategory: catchAsync(
    async (req, res, next) => {
      const adminId = req.user?.id;
      const category = await AdminServices.createCategory(
        req.body,
        adminId
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.CREATED,
        message: "Category created successfully",
        data: category
      });
    }
  ),
  updateCategory: catchAsync(
    async (req, res, next) => {
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new AppError_default(es_default.BAD_REQUEST, "Category ID is required");
      }
      const category = await AdminServices.updateCategory(
        categoryId,
        req.body
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Category updated successfully",
        data: category
      });
    }
  ),
  deleteCategory: catchAsync(
    async (req, res, next) => {
      const categoryId = req.params.id;
      if (!categoryId) {
        throw new AppError_default(es_default.BAD_REQUEST, "Category ID is required");
      }
      const result = await AdminServices.deleteCategory(categoryId);
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Category deleted successfully",
        data: result
      });
    }
  ),
  verifyProvider: catchAsync(
    async (req, res, next) => {
      const providerId = req.params.id;
      if (!providerId) {
        throw new AppError_default(es_default.BAD_REQUEST, "Provider ID is required");
      }
      const provider = await AdminServices.verifyProvider(
        providerId,
        req.body
      );
      sendResponse(res, {
        success: true,
        statusCode: es_default.OK,
        message: "Provider verification updated successfully",
        data: provider
      });
    }
  )
};

// src/app/modules/admin/admin.route.ts
var router7 = Router7();
router7.get("/users", checkAuth("admin" /* admin */), AdminControllers.getAllUsers);
router7.patch(
  "/users/:id",
  checkAuth("admin" /* admin */),
  AdminControllers.updateUserStatus
);
router7.get("/orders", checkAuth("admin" /* admin */), AdminControllers.getAllOrders);
router7.get(
  "/categories",
  checkAuth("admin" /* admin */),
  AdminControllers.getAllCategories
);
router7.post(
  "/categories",
  checkAuth("admin" /* admin */),
  AdminControllers.createCategory
);
router7.patch(
  "/categories/:id",
  checkAuth("admin" /* admin */),
  AdminControllers.updateCategory
);
router7.delete(
  "/categories/:id",
  checkAuth("admin" /* admin */),
  AdminControllers.deleteCategory
);
router7.patch(
  "/providers/:id/verify",
  checkAuth("admin" /* admin */),
  AdminControllers.verifyProvider
);
var AdminRoutes = router7;

// src/app/routes/index.ts
var router8 = Router8();
var moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/meals",
    route: MealRoutes
  },
  {
    path: "/providers",
    route: ProviderPublicRoutes
  },
  {
    path: "/orders",
    route: OrderRoutes
  },
  {
    path: "/cart",
    route: CartRoutes
  },
  {
    path: "/admin",
    route: AdminRoutes
  },
  {
    path: "/provider",
    route: ProviderRoutes
  }
  // {
  //   path: "/user",
  //   route: UserRoutes,
  // },
  // {
  //   path: "/product",
  //   route: ProductRoutes,
  // },
  // {
  //   path: "/category",
  //   route: CategoryRoutes,
  // },
  // {
  //   path: "/image",
  //   route: ImageRoutes,
  // },
];
moduleRoutes.forEach((route) => {
  router8.use(route.path, route.route);
});

// src/app/middlewares/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("============================================");
    console.log(err);
    console.log("============================================");
  }
  let errorSources = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";
  if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        statusCode = 409;
        const target = err.meta?.target?.join(", ");
        message = target ? `Duplicate value for: ${target}` : "Duplicate value error";
        break;
      }
      case "P2003": {
        statusCode = 409;
        message = "Foreign key constraint failed";
        break;
      }
      case "P2025": {
        statusCode = 404;
        message = "Record not found";
        break;
      }
      case "P2000": {
        statusCode = 400;
        message = "Value too long for column";
        break;
      }
      case "P2011": {
        statusCode = 400;
        message = "Null constraint violation";
        break;
      }
      case "P2014": {
        statusCode = 409;
        message = "Relation violation";
        break;
      }
      default: {
        statusCode = 400;
        message = err.message;
      }
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid request data";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Database connection error";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    message = "Database engine panic";
  } else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation error";
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null
  });
};

// src/app/middlewares/notFound.ts
var notFound = (req, res) => {
  res.status(es_default.NOT_FOUND).json({
    success: false,
    message: "Route Not Found"
  });
};
var notFound_default = notFound;

// src/app.ts
import { toNodeHandler } from "better-auth/node";
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
app.use(
  "/api/auth",
  (req, res, next) => {
    const { role } = req.body;
    if (role && role === "admin") {
      req.body.status = "pending";
    }
    next();
  },
  toNodeHandler(auth)
);
app.use("/api", router8);
app.get("/", (_, res) => {
  res.send({
    message: "Welcome to the APP, this is a E-Commerce API",
    success: true
  });
});
app.use(globalErrorHandler);
app.use(notFound_default);

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

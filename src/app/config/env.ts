import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENV: "development" | "production";
  EXPRESS_SESSION_SECRET?: string;
  BETTER_AUTH_SECRET: string;
  CLOUDINARY_URL?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;

  //   BCRYPT_SALT_ROUND: number;
  //   JWT_ACCESS_SECRET?: string;
  //   JWT_REFRESH_SECRET?: string;
  //   JWT_ACCESS_EXPIRES: string;
  //   JWT_REFRESH_EXPIRES: string;
  FRONTEND_URL: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  //   GOOGLE_CALLBACK_URL?: string;
  //   EXPRESS_SESSION_SECRET?: string;
  //   GEO_API_KEY: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_PORT: string;
    SMTP_HOST: string;
    SMTP_FROM: string;
  };
  //   REDIS_USERNAME?: string;
  //   REDIS_PASSWORD?: string;
  //   REDIS_HOST?: string;
  //   REDIS_PORT?: number;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
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
    "SMTP_FROM",
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
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    // BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND) || 10,
    // JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    // JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    // JWT_ACCESS_EXPIRES: (process.env.JWT_ACCESS_EXPIRES as string) || "1h",
    // JWT_REFRESH_EXPIRES: (process.env.JWT_REFRESH_EXPIRES as string) || "7d",
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL!,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    // GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    // EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER!,
      SMTP_PASS: process.env.SMTP_PASS!,
      SMTP_PORT: process.env.SMTP_PORT!,
      SMTP_HOST: process.env.SMTP_HOST!,
      SMTP_FROM: process.env.SMTP_FROM!,
    },
    // GEO_API_KEY: process.env.GEO_API_KEY!,
    // REDIS_USERNAME: process.env.REDIS_USERNAME,
    // REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    // REDIS_HOST: process.env.REDIS_HOST,
    // REDIS_PORT: Number(process.env.REDIS_PORT),
  };
};

export const envVars = loadEnvVariables();

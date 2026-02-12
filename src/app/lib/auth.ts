import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/sendEmail";
import { envVars } from "../config/env";
import {
  getFrontendOrigins,
  getPrimaryFrontendOrigin,
} from "../config/origins";
import { Role, UserStatus } from "../modules/user/user.interface";

const trustedOrigins = getFrontendOrigins();
const primaryFrontendOrigin = getPrimaryFrontendOrigin();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const incomingRole = user.role as Role | undefined;
          const safeRole =
            incomingRole === Role.provider ? Role.provider : Role.customer;

          return {
            data: {
              ...user,
              role: safeRole,
            },
          };
        },
      },
    },
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET as string,
  trustedOrigins,
  user: {
    additionalFields: {
      role: {
        type: [...Object.values(Role)],
        required: true,
        defaultValue: "customer",
      },
      phone: {
        type: "string",
        required: true,
        unique: true,
      },
      status: {
        type: [...Object.values(UserStatus)],
        required: false,
        defaultValue: "active",
      },
      isSubscribed: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
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
          resetUILink: `${primaryFrontendOrigin}/auth/reset-password?id=${user.id}&token=${token}`,
        },
      });
    },
    onPasswordReset: async ({ user }, request) => {
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const resetUILink = `${primaryFrontendOrigin}/auth/verify?id=${user.id}&token=${token}`;

      sendEmail({
        to: user.email,
        subject: "Verify your email address",
        templateName: "verifyEmail",
        templateData: {
          name: user.name,
          resetUILink,
        },
      });
      console.log("Verification URL:", url);
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: envVars.GOOGLE_CLIENT_ID!,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
    },
  },
});

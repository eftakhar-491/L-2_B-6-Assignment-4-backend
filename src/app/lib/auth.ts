import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "../utils/sendEmail";
import { envVars } from "../config/env";
import { Role, UserStatus } from "../modules/user/user.interface";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET as string,
  trustedOrigins: [process.env.FRONTEND_URL as string],
  user: {
    additionalFields: {
      role: {
        type: [...Object.values(Role)],
        required: true,
        defaultValue: "USER",
      },
      phone: {
        type: "string",
        required: true,
        unique: true,
      },
      status: {
        type: [...Object.values(UserStatus)],
        required: false,
        defaultValue: "ACTIVE",
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
          resetUILink: `${envVars.FRONTEND_URL}/auth/reset-password?id=${user.id}&token=${token}`,
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
      const resetUILink = `${envVars.FRONTEND_URL}/auth/verify?id=${user.id}&token=${token}`;

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

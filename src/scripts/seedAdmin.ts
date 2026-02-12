import "dotenv/config";
import { auth } from "../app/lib/auth";
import { prisma } from "../app/lib/prisma";
import { getPrimaryFrontendOrigin } from "../app/config/origins";
import { Role, UserStatus } from "../app/modules/user/user.interface";

const resolveSeedPhone = async (preferredPhone?: string | null) => {
  const basePhone = preferredPhone?.trim() || "+10000000000";
  const existing = await prisma.user.findFirst({
    where: { phone: basePhone },
    select: { id: true },
  });

  if (!existing) return basePhone;

  const fallback = `+1999${Date.now().toString().slice(-7)}`;
  return fallback;
};

const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD?.trim();
  const name = process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin";
  const preferredPhone = process.env.SUPER_ADMIN_PHONE?.trim();
  const origin = getPrimaryFrontendOrigin();

  if (!email || !password) {
    throw new Error(
      "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required for seeding.",
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, phone: true },
  });

  if (!existing) {
    const phone = await resolveSeedPhone(preferredPhone);

    await auth.api.signUpEmail({
      headers: new Headers({
        origin,
      }),
      body: {
        name,
        email,
        password,
        phone,
        role: Role.super_admin,
        status: UserStatus.active,
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, phone: true },
  });

  if (!user) {
    throw new Error("Super admin seeding failed. User was not created.");
  }

  const phoneToKeep = user.phone || (await resolveSeedPhone(preferredPhone));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      role: Role.super_admin,
      status: UserStatus.active,
      isActive: true,
      emailVerified: true,
      phone: phoneToKeep,
    },
  });

  console.log(`Super admin ready: ${email}`);
};

seedSuperAdmin()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed super admin:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

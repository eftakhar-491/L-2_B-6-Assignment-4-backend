import "dotenv/config";
import { auth } from "../app/lib/auth";
import { prisma } from "../app/lib/prisma";
import { getPrimaryFrontendOrigin } from "../app/config/origins";
import { Role, UserStatus } from "../app/modules/user/user.interface";

type PrivilegedRole = Role.admin | Role.super_admin;

interface SeedPrivilegedUserPayload {
  role: PrivilegedRole;
  email?: string | null;
  password?: string | null;
  name?: string | null;
  preferredPhone?: string | null;
  origin: string;
  requireCredentials?: boolean;
}

const resolveSeedPhone = async (preferredPhone?: string | null) => {
  const basePhone = preferredPhone?.trim() || "+10000000000";
  const existing = await prisma.user.findFirst({
    where: { phone: basePhone },
    select: { id: true },
  });

  if (!existing) return basePhone;

  return `+1999${Date.now().toString().slice(-7)}`;
};

const seedPrivilegedUser = async ({
  role,
  email,
  password,
  name,
  preferredPhone,
  origin,
  requireCredentials = false,
}: SeedPrivilegedUserPayload) => {
  const normalizedEmail = email?.trim();
  const normalizedPassword = password?.trim();
  const normalizedName = name?.trim() || (role === Role.admin ? "Admin" : "Super Admin");

  if (!normalizedEmail || !normalizedPassword) {
    if (requireCredentials) {
      const roleLabel = role === Role.admin ? "ADMIN" : "SUPER_ADMIN";
      throw new Error(
        `${roleLabel}_EMAIL and ${roleLabel}_PASSWORD are required for seeding.`,
      );
    }
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, phone: true },
  });

  if (!existing) {
    const phone = await resolveSeedPhone(preferredPhone);

    await auth.api.signUpEmail({
      headers: new Headers({ origin }),
      body: {
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword,
        phone,
        role,
        status: UserStatus.active,
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, phone: true },
  });

  if (!user) {
    throw new Error(`${role} seeding failed. User was not created.`);
  }

  const phoneToKeep = user.phone || (await resolveSeedPhone(preferredPhone));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: normalizedName,
      role,
      status: UserStatus.active,
      isActive: true,
      emailVerified: true,
      phone: phoneToKeep,
    },
  });

  console.log(`${role} ready: ${normalizedEmail}`);
};

const seedAdminUsers = async () => {
  const origin = getPrimaryFrontendOrigin();

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.trim();
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD?.trim();
  const superAdminName = process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin";
  const superAdminPhone = process.env.SUPER_ADMIN_PHONE?.trim() || "+10000000000";

  const adminEmail =
    process.env.ADMIN_EMAIL?.trim() || "foodhub.admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD?.trim() || "Admin12345!";
  const adminName = process.env.ADMIN_NAME?.trim() || "Platform Admin";
  const adminPhone = process.env.ADMIN_PHONE?.trim() || "+10000000001";

  await seedPrivilegedUser({
    role: Role.super_admin,
    email: superAdminEmail,
    password: superAdminPassword,
    name: superAdminName,
    preferredPhone: superAdminPhone,
    origin,
    requireCredentials: true,
  });

  if (
    superAdminEmail &&
    superAdminEmail.toLowerCase() === adminEmail.toLowerCase()
  ) {
    console.warn(
      "ADMIN_EMAIL matches SUPER_ADMIN_EMAIL. Skipping admin seeding to avoid role conflicts.",
    );
    return;
  }

  await seedPrivilegedUser({
    role: Role.admin,
    email: adminEmail,
    password: adminPassword,
    name: adminName,
    preferredPhone: adminPhone,
    origin,
    requireCredentials: false,
  });
};

seedAdminUsers()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed privileged users:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

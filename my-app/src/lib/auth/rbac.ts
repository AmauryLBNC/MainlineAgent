import { prisma } from "@/lib/prisma";
import {
  PERMISSION_DESCRIPTIONS,
  ROLE_DEFINITIONS,
  type PermissionName,
} from "@/lib/auth/permissions";

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function waitForUser(userId: string, attempts = 5, delayMs = 75) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (user) {
      return user;
    }

    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return null;
}

export async function ensureRbacSeed() {
  for (const [name, description] of Object.entries(PERMISSION_DESCRIPTIONS)) {
    await prisma.permission.upsert({
      where: { name },
      update: { description },
      create: { name, description },
    });
  }

  for (const [roleName, roleDefinition] of Object.entries(ROLE_DEFINITIONS)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: { description: roleDefinition.description },
      create: {
        name: roleName,
        description: roleDefinition.description,
      },
    });

    for (const permissionName of roleDefinition.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { name: permissionName },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

export async function bootstrapUserRoles(
  userId: string,
  email?: string | null
) {
  await ensureRbacSeed();
  const user = await waitForUser(userId);

  if (!user) {
    return;
  }

  const [userRole, adminRole, userCount] = await Promise.all([
    prisma.role.findUniqueOrThrow({ where: { name: "USER" } }),
    prisma.role.findUniqueOrThrow({ where: { name: "ADMIN" } }),
    prisma.user.count(),
  ]);

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: userRole.id,
    },
  });

  const normalizedEmail = email?.trim().toLowerCase();
  const userEmail = user.email?.trim().toLowerCase();
  const shouldBeAdmin =
    (normalizedEmail ? getAdminEmails().has(normalizedEmail) : false) ||
    (userEmail ? getAdminEmails().has(userEmail) : false) ||
    userCount === 1;

  if (!shouldBeAdmin) {
    return;
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: adminRole.id,
    },
  });
}

export async function getUserAuthorization(userId: string) {
  const assignments = await prisma.userRole.findMany({
    where: { userId },
    select: {
      role: {
        select: {
          name: true,
          permissions: {
            select: {
              permission: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const roles = assignments.map(({ role }) => role.name).sort();
  const permissions = Array.from(
    new Set(
      assignments.flatMap(({ role }) =>
        role.permissions.map(({ permission }) => permission.name)
      )
    )
  ).sort();

  return { roles, permissions };
}

export function hasPermission(
  permissions: string[] | undefined,
  requiredPermission: PermissionName
) {
  return permissions?.includes(requiredPermission) ?? false;
}

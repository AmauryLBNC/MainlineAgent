import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const basePermissions = [
  {
    name: "VIEW_DASHBOARD",
    description: "Access the authenticated dashboard.",
  },
  {
    name: "VIEW_PROFILE",
    description: "Access the authenticated profile page.",
  },
  {
    name: "MANAGE_SETTINGS",
    description: "Manage personal settings.",
  },
  {
    name: "CREATE_ANALYSIS_MESSAGE",
    description: "Create AI pedagogy analysis messages.",
  },
  {
    name: "READ_ANALYSIS_MESSAGE",
    description: "Read AI pedagogy analysis messages.",
  },
  {
    name: "ACCESS_ADMIN",
    description: "Access the admin area.",
  },
  {
    name: "MANAGE_USERS",
    description: "Read and manage user roles.",
  },
];

const roleMatrix = {
  USER: [
    "VIEW_DASHBOARD",
    "VIEW_PROFILE",
    "MANAGE_SETTINGS",
    "CREATE_ANALYSIS_MESSAGE",
    "READ_ANALYSIS_MESSAGE",
  ],
  ADMIN: [
    "VIEW_DASHBOARD",
    "VIEW_PROFILE",
    "MANAGE_SETTINGS",
    "CREATE_ANALYSIS_MESSAGE",
    "READ_ANALYSIS_MESSAGE",
    "ACCESS_ADMIN",
    "MANAGE_USERS",
  ],
};

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

async function seedPermissions() {
  for (const permission of basePermissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });
  }
}

async function seedRoles() {
  for (const [roleName, permissions] of Object.entries(roleMatrix)) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {
        description:
          roleName === "ADMIN"
            ? "Platform administrators with advanced permissions."
            : "Default authenticated user role.",
      },
      create: {
        name: roleName,
        description:
          roleName === "ADMIN"
            ? "Platform administrators with advanced permissions."
            : "Default authenticated user role.",
      },
    });

    for (const permissionName of permissions) {
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

async function assignBootstrapAdmins() {
  const adminEmails = getAdminEmails();

  if (adminEmails.size === 0) {
    return;
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  });

  if (!adminRole) {
    return;
  }

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: Array.from(adminEmails),
      },
    },
    select: {
      id: true,
    },
  });

  for (const user of users) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: adminRole.id,
      },
    });
  }
}

async function main() {
  await seedPermissions();
  await seedRoles();
  await assignBootstrapAdmins();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed RBAC data.", error);
    await prisma.$disconnect();
    process.exit(1);
  });

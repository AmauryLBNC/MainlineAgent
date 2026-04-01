import { prisma } from "@/lib/prisma";

export async function getUsersWithRoles() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      roles: {
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
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    roles: user.roles.map(({ role }) => role.name).sort(),
    permissions: Array.from(
      new Set(
        user.roles.flatMap(({ role }) =>
          role.permissions.map(({ permission }) => permission.name)
        )
      )
    ).sort(),
  }));
}

export async function getUserSnapshot(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      accounts: {
        select: {
          provider: true,
          type: true,
        },
      },
      roles: {
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
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    roles: user.roles.map(({ role }) => role.name).sort(),
    permissions: Array.from(
      new Set(
        user.roles.flatMap(({ role }) =>
          role.permissions.map(({ permission }) => permission.name)
        )
      )
    ).sort(),
  };
}

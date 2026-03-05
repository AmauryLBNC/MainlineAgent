import { prisma } from "@/lib/prisma";

type RawRolePermission = {
  permission: {
    name: string;
  };
};

type RawUserRole = {
  role: {
    name: string;
    permissions: RawRolePermission[];
  };
};

type RawUserWithRoles = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  roles: RawUserRole[];
};

type RawUserSnapshot = RawUserWithRoles & {
  updatedAt: Date;
  accounts: {
    provider: string;
    type: string;
  }[];
};

export type UserWithRoles = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  roles: string[];
  permissions: string[];
};

export type UserSnapshot = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  accounts: {
    provider: string;
    type: string;
  }[];
  roles: string[];
  permissions: string[];
};

export async function getUsersWithRoles(): Promise<UserWithRoles[]> {
  const users: RawUserWithRoles[] = await prisma.user.findMany({
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

  return users.map((user): UserWithRoles => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    roles: user.roles.map((userRole) => userRole.role.name).sort(),
    permissions: Array.from(
      new Set(
        user.roles.flatMap((userRole) =>
          userRole.role.permissions.map(
            (rolePermission) => rolePermission.permission.name
          )
        )
      )
    ).sort(),
  }));
}

export async function getUserSnapshot(
  userId: string
): Promise<UserSnapshot | null> {
  const user: RawUserSnapshot | null = await prisma.user.findUnique({
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
    roles: user.roles.map((userRole) => userRole.role.name).sort(),
    permissions: Array.from(
      new Set(
        user.roles.flatMap((userRole) =>
          userRole.role.permissions.map(
            (rolePermission) => rolePermission.permission.name
          )
        )
      )
    ).sort(),
  };
}

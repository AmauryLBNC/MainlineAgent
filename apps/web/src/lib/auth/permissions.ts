export const PERMISSIONS = {
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_PROFILE: "VIEW_PROFILE",
  MANAGE_SETTINGS: "MANAGE_SETTINGS",
  CREATE_ANALYSIS_MESSAGE: "CREATE_ANALYSIS_MESSAGE",
  READ_ANALYSIS_MESSAGE: "READ_ANALYSIS_MESSAGE",
  ACCESS_ADMIN: "ACCESS_ADMIN",
  MANAGE_USERS: "MANAGE_USERS",
} as const;

export type PermissionName =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_DEFINITIONS = {
  USER: {
    description: "Default authenticated user role.",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PROFILE,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.CREATE_ANALYSIS_MESSAGE,
      PERMISSIONS.READ_ANALYSIS_MESSAGE,
    ],
  },
  ADMIN: {
    description: "Platform administrators with advanced permissions.",
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_PROFILE,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.CREATE_ANALYSIS_MESSAGE,
      PERMISSIONS.READ_ANALYSIS_MESSAGE,
      PERMISSIONS.ACCESS_ADMIN,
      PERMISSIONS.MANAGE_USERS,
    ],
  },
} as const;

export const PERMISSION_DESCRIPTIONS: Record<PermissionName, string> = {
  [PERMISSIONS.VIEW_DASHBOARD]: "Access the authenticated dashboard.",
  [PERMISSIONS.VIEW_PROFILE]: "Access the authenticated profile page.",
  [PERMISSIONS.MANAGE_SETTINGS]: "Manage personal settings.",
  [PERMISSIONS.CREATE_ANALYSIS_MESSAGE]:
    "Create AI pedagogy analysis messages.",
  [PERMISSIONS.READ_ANALYSIS_MESSAGE]:
    "Read AI pedagogy analysis messages.",
  [PERMISSIONS.ACCESS_ADMIN]: "Access the admin area.",
  [PERMISSIONS.MANAGE_USERS]: "Read and manage user roles.",
};

export type RoleName = keyof typeof ROLE_DEFINITIONS;

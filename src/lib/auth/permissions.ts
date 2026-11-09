import { UserRole } from "@/models/User";

export type PermissionAction =
  | "manage:all"
  | "read:leads"
  | "write:leads"
  | "delete:leads"
  | "assign:leads"
  | "read:quotations"
  | "write:quotations"
  | "approve:quotations"
  | "read:surveys"
  | "write:surveys"
  | "read:installations"
  | "write:installations"
  | "read:products"
  | "write:products"
  | "read:cms"
  | "write:cms"
  | "read:media"
  | "write:media"
  | "read:analytics"
  | "manage:settings"
  | "manage:team";

const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  super_admin: ["manage:all"],
  admin: [
    "read:leads",
    "write:leads",
    "assign:leads",
    "read:quotations",
    "write:quotations",
    "approve:quotations",
    "read:surveys",
    "write:surveys",
    "read:installations",
    "write:installations",
    "read:products",
    "write:products",
    "read:cms",
    "write:cms",
    "read:media",
    "write:media",
    "read:analytics",
    "manage:settings",
  ],
  sales_manager: [
    "read:leads",
    "write:leads",
    "assign:leads",
    "read:quotations",
    "write:quotations",
    "approve:quotations",
    "read:surveys",
    "write:surveys",
    "read:analytics",
  ],
  sales_executive: ["read:leads", "write:leads", "read:surveys"],
  installation_manager: [
    "read:surveys",
    "write:surveys",
    "read:installations",
    "write:installations",
    "read:media",
    "write:media",
  ],
  technician: ["read:surveys", "write:surveys", "read:installations", "write:installations"],
  content_editor: [
    "read:products",
    "write:products",
    "read:cms",
    "write:cms",
    "read:media",
    "write:media",
  ],
  viewer: [
    "read:leads",
    "read:surveys",
    "read:installations",
    "read:products",
    "read:cms",
    "read:analytics",
  ],
};

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  if (role === "super_admin") return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action) || permissions.includes("manage:all");
}

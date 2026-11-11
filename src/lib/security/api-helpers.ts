import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/auth/session";
import { hasPermission, type PermissionAction } from "@/lib/auth/permissions";
import { isValidObjectId } from "@/lib/security/sanitize";

export type AuthGuardResult =
  | { ok: true; session: SessionPayload }
  | { ok: false; response: NextResponse };

/**
 * Shared RBAC session guard for protected Admin/CRM API routes.
 */
export async function requirePermission(
  permission: PermissionAction
): Promise<AuthGuardResult> {
  const session = await getSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!hasPermission(session.role, permission)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, session };
}

export function invalidIdResponse(label = "ID") {
  return NextResponse.json({ error: `Invalid ${label}` }, { status: 400 });
}

export function validateIdParam(id?: string, label = "ID"): NextResponse | null {
  if (!isValidObjectId(id)) {
    return invalidIdResponse(label);
  }
  return null;
}

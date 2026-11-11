import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

function applySecurityHeaders(res: NextResponse, isSensitiveRoute: boolean) {
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  if (isSensitiveRoute) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.headers.set("Cache-Control", "no-store, max-age=0");
  }
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");
  const isSensitive = isAdminRoute || isApiRoute;

  if (isAdminRoute) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (pathname === "/admin/login") {
      if (session) {
        const res = NextResponse.redirect(new URL("/admin/dashboard", req.url));
        return applySecurityHeaders(res, true);
      }
      return applySecurityHeaders(NextResponse.next(), true);
    }

    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      if (token) {
        res.cookies.delete(SESSION_COOKIE_NAME);
      }
      return applySecurityHeaders(res, true);
    }
  }

  return applySecurityHeaders(NextResponse.next(), isSensitive);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico)$).*)",
  ],
};

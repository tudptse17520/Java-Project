// ---------------------------------------------
// Middleware
// Bảo mật tuyến đường (Route Guard) dựa trên Cookie
// Đặt tại gốc /src
// ---------------------------------------------

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// =============================================
// Route Definitions
// =============================================

/** Các route không cần xác thực */
const PUBLIC_ROUTES = ["/", "/login"];

/** Mapping role -> prefix route được phép truy cập */
const ROLE_ROUTE_MAP: Record<string, string[]> = {
  ADMIN: ["/admin"],
  MANAGER: ["/manager"],
  STAFF: ["/staff"],
  USER: ["/browse", "/reservations", "/vehicles", "/profile"],
};

/** Mapping role -> đường dẫn dashboard mặc định */
const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  MANAGER: "/manager/dashboard",
  STAFF: "/staff/dashboard",
  USER: "/browse",
};

// =============================================
// Helper Functions
// =============================================

/**
 * Kiểm tra route có phải public không
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}?`)
  );
}

/**
 * Decode JWT payload từ token string
 * Placeholder - chỉ decode base64, không verify signature
 */
function decodeJwtPayload(
  token: string
): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );
    return payload;
  } catch {
    return null;
  }
}

/**
 * Kiểm tra user có quyền truy cập route không
 */
function hasRouteAccess(role: string, pathname: string): boolean {
  const allowedPrefixes = ROLE_ROUTE_MAP[role];
  if (!allowedPrefixes) return false;
  return allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

// =============================================
// Middleware
// =============================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bỏ qua static files và API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Public routes - cho phép truy cập
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 3. Kiểm tra token
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    // Chưa đăng nhập -> redirect về login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Decode token và kiểm tra role
  const payload = decodeJwtPayload(token);

  if (!payload || !payload.role) {
    // Token không hợp lệ -> redirect về login
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );
    response.cookies.delete("access_token");
    return response;
  }

  // 5. Kiểm tra token hết hạn
  if (payload.exp && Date.now() >= payload.exp * 1000) {
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );
    response.cookies.delete("access_token");
    return response;
  }

  // 6. Kiểm tra quyền truy cập route
  if (!hasRouteAccess(payload.role, pathname)) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  // 7. Cho phép truy cập
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

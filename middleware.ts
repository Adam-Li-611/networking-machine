import { NextResponse, type NextRequest } from "next/server";
import { isValidAuthCookieValue } from "@/lib/auth-cookie";

const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    return NextResponse.next();
  }

  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = await isValidAuthCookieValue(request.cookies.get("networking_machine_auth")?.value, appPassword);
  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

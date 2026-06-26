import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = ["princemaiga09@hotmail.com", "admin@afrimatch.app"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect /admin/* routes — only whitelisted admin emails
    if (pathname.startsWith("/admin")) {
      if (!token?.email || !ADMIN_EMAILS.includes(token.email as string)) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.url);
        loginUrl.searchParams.set("error", "AccessDenied");
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Admin routes require authentication
        if (pathname.startsWith("/admin")) {
          return !!token;
        }
        // Dashboard requires authentication
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }
        // All other routes are public
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';

export default withAuth(
  function middleware(req) {
    // If they're trying to access the signin page and are already logged in,
    // redirect them to the dashboard
    if (req.nextUrl.pathname.startsWith("/auth/signin") && req.nextauth?.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Public paths that don't require authentication
        const publicPaths = [
          "/",
          "/about",
          "/auth/signin",
          "/auth/signup",
          "/api/auth"
        ];
        const isPublicPath = publicPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path)
        );

        // Allow access to public paths without authentication
        if (isPublicPath) return true;

        // Require authentication for protected paths
        const protectedPaths = [
          "/dashboard",
          "/tasks",
          "/rewards",
          "/leaderboard",
          "/manager",
          "/onboarding",
          "/achievements"
        ];
        const isProtectedPath = protectedPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path)
        );

        // Only require authentication for protected paths
        return !isProtectedPath || !!token;
      },
    },
  }
);

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // If user is authenticated, track their activity
  if (token?.sub) {
    // Don't await this to avoid blocking the request
    fetch(new URL('/api/user/activity', request.url), {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    }).catch(console.error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 
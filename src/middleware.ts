import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';

// Define public assets that should bypass authentication
const publicAssets = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon.png',
  '/favicon.ico',
];

// Define public paths that don't require authentication
const publicPaths = [
  "/",
  "/about",
  "/auth/signin",
  "/auth/signup",
  "/api/auth"
];

export default withAuth(
  async function middleware(req: NextRequest) {
    // Check if the request is for a public asset
    if (publicAssets.some(asset => req.nextUrl.pathname === asset)) {
      return NextResponse.next();
    }

    // If they're trying to access the signin page and are already logged in,
    // check token directly instead of using req.nextauth
    const token = await getToken({ req });
    if (req.nextUrl.pathname.startsWith("/auth/signin") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Track user activity if authenticated
    if (token?.sub) {
      // Don't await this to avoid blocking the request
      fetch(new URL('/api/user/activity', req.url), {
        method: 'POST',
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        },
      }).catch(console.error);
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
          "/api/auth",
          "/api/manifest"  // Allow access to manifest API
        ];
        const isPublicPath = publicPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path)
        );

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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - manifest.json (PWA manifest)
     * - api/manifest (manifest API route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - icon files and other public assets
     */
    '/((?!manifest.json|api/manifest|_next/static|_next/image|icon-|favicon.ico).*)',
  ],
}; 
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicFiles = [
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/favicon.ico",
  // Add other public assets like images in /public if needed
  "/screenshots/tasks-mobile-light.png",
  "/screenshots/tasks-mobile-dark.png",
  "/screenshots/tasks-light.png",
  "/screenshots/tasks-dark.png",
  // Consider using a broader pattern if many assets need exclusion
];

// Public paths that don't require authentication
const publicPaths = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/auth/error",
  "/api/auth",
];

// Optional but Recommended: Use a matcher to avoid running middleware on unnecessary paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Include manifest.json and icons explicitly if needed,
     *   OR rely on the check within the middleware function.
     *   Using the matcher is generally more performant.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|screenshots/.*\\.png).*)',
  ],
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`--- MIDDLEWARE EXECUTED for path: ${pathname} ---`); // <--- ADD THIS LOG

  // Check for public files first
  if (publicFiles.some(path => pathname.startsWith(path))) {
     console.log(`>>> Middleware allowing public asset: ${pathname}`);
     return NextResponse.next();
  }

  // Check for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Verify authentication token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If user is not authenticated and trying to access protected route
    if (!token) {
      // Redirect to sign in page with callback URL
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(signInUrl);
    }

    // If user is authenticated but hasn't completed onboarding (no businessId)
    if (!token.businessId && !pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Special routes that require specific roles
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/manager") && token.role !== "MANAGER" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Track user activity (don't await to avoid blocking)
    fetch(new URL('/api/user/activity', request.url), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${request.cookies.get('next-auth.session-token')?.value || ''}`,
      },
    }).catch(console.error);

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, redirect to error page
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
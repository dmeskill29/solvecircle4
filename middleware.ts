import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
    // Simpler matcher if you prefer checking inside the function for ALL paths:
    // '/:path*',
  ],
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // --- Option 1: Check using the array (if not using a precise matcher) ---
  // if (publicFiles.some(file => pathname === file)) {
  //   return NextResponse.next();
  // }

  // --- Option 2: Check using startsWith for directories (if applicable) ---
  if (
    pathname === "/manifest.json" ||
    pathname.startsWith("/icon-") || // Covers both icons
    pathname.startsWith("/screenshots/") || // Covers all screenshots
    pathname === "/favicon.ico"
  ) {
      console.log(`Allowing public asset: ${pathname}`); // Add logging
      return NextResponse.next();
  }

  console.log(`Processing non-public path: ${pathname}`); // Add logging

  // --- Placeholder for your actual logic for non-public routes ---
  // For example, check authentication:
  // const session = await getSession(); // Replace with your auth method
  // if (!session) {
  //   const loginUrl = new URL('/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // If no specific action needed for other routes by THIS middleware, let Next.js handle them
  return NextResponse.next();
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add manifest.json to the list of public files
const publicFiles = [
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  // Check if the requested path is a public file
  if (publicFiles.some(file => request.nextUrl.pathname === file)) {
    return NextResponse.next();
  }

  // ... rest of your middleware logic ...
} 
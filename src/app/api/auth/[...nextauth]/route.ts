import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Use Node.js runtime instead of Edge Runtime
export const runtime = "nodejs";

// Ensure the route is properly configured for Edge Runtime
export const dynamic = "force-dynamic"; 
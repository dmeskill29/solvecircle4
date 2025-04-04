import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

interface AuthenticatedSession extends Session {
  user: {
    id: string;
    role: UserRole;
    points: number;
    businessId?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export type AuthSession = AuthenticatedSession | null;

export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return session as AuthenticatedSession;
}

export async function requireManagerAuth(): Promise<AuthenticatedSession> {
  const session = await requireAuth();
  
  if (session.user.role !== "MANAGER") {
    redirect("/dashboard");
  }

  return session;
}

export async function requireAdminAuth(): Promise<AuthenticatedSession> {
  const session = await requireAuth();
  
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthenticatedSession> {
  const session = await requireAuth();
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard");
  }

  return session;
}

export function hasRole(session: AuthSession, role: UserRole): boolean {
  return session?.user?.role === role;
}

export function hasAnyRole(session: AuthSession, roles: UserRole[]): boolean {
  return !!session?.user?.role && roles.includes(session.user.role);
}

export function isAuthenticated(session: AuthSession): boolean {
  return !!session?.user;
}

export function getRedirectUrl(callbackUrl?: string): string {
  if (!callbackUrl || callbackUrl.includes("/auth/signin")) {
    return "/dashboard";
  }

  // Only allow relative URLs that don't contain signin
  if (callbackUrl.startsWith("/") && !callbackUrl.includes("/auth/signin")) {
    return callbackUrl;
  }

  return "/dashboard";
} 
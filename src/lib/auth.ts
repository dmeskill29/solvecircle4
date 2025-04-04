import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { getServerSession } from "next-auth/next";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              business: true,
              ownedBusiness: true,
            },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            points: user.points,
            businessId: user.businessId || user.ownedBusiness?.id,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Authentication failed");
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.points = user.points;
        token.businessId = user.businessId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "MANAGER" | "EMPLOYEE";
        session.user.points = token.points as number;
        session.user.businessId = token.businessId as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Decode the URL to handle encoded URLs
      const decodedUrl = decodeURIComponent(url);
      
      // Skip redirect for PWA-related files
      if (decodedUrl.endsWith('manifest.json') || 
          decodedUrl.endsWith('sw.js') || 
          decodedUrl.match(/workbox-[\w-]+\.js$/)) {
        return url;
      }

      // If the URL contains /auth/signin, check if user needs onboarding
      if (decodedUrl.includes("/auth/signin")) {
        try {
          const session = await getServerSession(authOptions);
          if (session?.user?.id) {
            const user = await prisma.user.findUnique({
              where: { id: session.user.id },
              select: { businessId: true },
            });
            
            if (!user?.businessId) {
              return `${baseUrl}/onboarding`;
            }
          }
          return `${baseUrl}/dashboard`;
        } catch (error) {
          console.error("Redirect error:", error);
          return `${baseUrl}/dashboard`;
        }
      }

      // Allow relative URLs that start with /
      if (decodedUrl.startsWith("/")) {
        return `${baseUrl}${decodedUrl}`;
      }

      // Allow same-origin URLs
      if (decodedUrl.startsWith(baseUrl)) {
        return decodedUrl;
      }

      // Default fallback
      return `${baseUrl}/dashboard`;
    }
  },
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user.email);
    },
    async signOut() {
      console.log("User signed out");
    }
  },
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.debug(code, metadata);
      }
    }
  }
}; 
import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InstallPWA } from "@/components/InstallPWA";
import { Navbar } from "@/components/Navbar";
import { UserMenu } from "@/components/UserMenu";
import { Providers } from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToasterProvider } from "@/components/ToasterProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#0284c7",
};

export const metadata: Metadata = {
  title: "SolveCircle",
  description: "A platform for solving problems together",
  manifest: "/manifest.json",
  icons: {
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SolveCircle",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "SolveCircle",
    title: "SolveCircle",
    description: "A platform for solving problems together",
  },
  twitter: {
    card: "summary",
    title: "SolveCircle",
    description: "A platform for solving problems together",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let isManager = false;

  if (session?.user?.id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          business: true,
        },
      });
      isManager = user?.role === "MANAGER";
    } catch (error) {
      console.error("Error fetching user data:", error);
      isManager = false;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <Providers session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                  <Navbar isManager={isManager} />
                  <UserMenu />
                </div>
              </header>
              <main className="container mx-auto px-4 py-8 space-y-8">
                <div className="max-w-7xl mx-auto">{children}</div>
              </main>
              <footer className="border-t border-gray-200">
                <div className="container mx-auto px-4 py-6">
                  <p className="text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} SolveCircle. All rights
                    reserved.
                  </p>
                </div>
              </footer>
              <ToasterProvider />
              <InstallPWA />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

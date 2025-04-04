"use client";

import { Fragment } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  isManager: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Tasks", href: "/tasks" },
  { name: "Rewards", href: "/rewards" },
  { name: "Achievements", href: "/achievements" },
];

const managerNavigation = [
  ...navigation,
  { name: "Analytics", href: "/analytics" },
  { name: "Categories", href: "/categories" },
];

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Sign In", href: "/auth/signin" },
];

export function Navbar({ isManager }: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const items = session
    ? isManager
      ? managerNavigation
      : navigation
    : publicNavigation;

  return (
    <nav className="flex items-center space-x-4">
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Link href={item.href}>{item.name}</Link>
        </Button>
      ))}
      <ThemeToggle />
    </nav>
  );
}

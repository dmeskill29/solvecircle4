"use client";

import { Fragment } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/Button";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Tasks", href: "/tasks" },
    ...(session?.user?.role === "MANAGER"
      ? [{ name: "Create Task", href: "/tasks/create" }]
      : []),
    { name: "Rewards", href: "/rewards" },
  ];

  const userNavigation = [
    { name: "Dashboard", href: "/" },
    { name: "Tasks", href: "/tasks" },
    ...(session?.user?.role === "MANAGER"
      ? [{ name: "Create Task", href: "/tasks/create" }]
      : []),
    { name: "Rewards", href: "/rewards" },
  ];

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link
                    href="/"
                    className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"
                  >
                    SolveCircle
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                      } rounded-md px-3 py-2 text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {session ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white ring-2 ring-gray-200 transition-all hover:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        {session.user?.image ? (
                          <Image
                            className="h-8 w-8 rounded-full"
                            src={session.user.image}
                            alt=""
                            width={32}
                            height={32}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500" />
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
                        <Menu.Item>
                          {() => (
                            <div className="px-4 py-2">
                              <div className="text-sm font-medium text-gray-900">
                                {session.user?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {session.user?.email}
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {() => (
                            <div className="px-4 py-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  Points
                                </span>
                                <span className="text-primary-600">
                                  {session.user?.points || 0}
                                </span>
                              </div>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {() => (
                            <button
                              onClick={() => signOut()}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Button onClick={() => signIn()} variant="default">
                    Sign in
                  </Button>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                  } block px-3 py-2 text-sm`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              {session ? (
                <>
                  <div className="flex items-center px-4">
                    {session.user?.image ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt=""
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500" />
                    )}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {session.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Points: {session.user?.points || 0}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as="button"
                      onClick={() => signOut()}
                      className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={() => signIn()}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  >
                    Sign in
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

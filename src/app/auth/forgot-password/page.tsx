"use client";

import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Password reset functionality coming soon!
            </p>
            <Link
              href="/auth/signin"
              className="font-semibold text-primary-600 hover:text-primary-500"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

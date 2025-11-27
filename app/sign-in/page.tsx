import { SignIn } from "@stackframe/stack";
import Link from "next/link";
import React from "react";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50  to-purple-100">
      <div className="space-y-8 max-w-md w-full ">
        <SignIn />
        <Link
          href="/"
          className="bg-purple-600 text-white px-8 mt-4 py-2 w-full rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 ease-linear ">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;

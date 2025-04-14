"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import useCurrentUser from "@/hooks/use-current-user";
import { useContext } from "react";
import { UserContext } from "@/contexts/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthenticatedLayout({ children }) {
  const currentUser = useCurrentUser();
  const { signOut } = useContext(UserContext);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          {currentUser ? (
            <>
              Welcome {currentUser.email}
              <Link
                href="#"
                onClick={() => signOut()}
                className="block sm:inline-block m-2 p-2 bg-blue-500 text-white rounded"
              >
                Logout
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="block sm:inline-block m-2 p-2 bg-blue-500 text-white rounded"
            >
              Login
            </Link>
          )}

          <main className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

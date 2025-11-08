"use client";

import { useState } from "react";
import Link from "next/link";
import supabase from "../supabase-client";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/UseAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const session = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/Auth"); // Redirect to home or login page after logout
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-zinc-100">
            Supabase Tasks
          </span>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Dashboard
          </Link>
          {session ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200/40"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/Auth"
              className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200/40"
            >
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          className="sm:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-6 w-6 text-zinc-100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-5 py-4 sm:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-300 transition hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            {session ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200/40"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/Auth"
                className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200/40"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

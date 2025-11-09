"use client";

import { useState } from "react";
import supabase from "../supabase-client";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/UseAuth";
const Auth = () => {
  const router = useRouter();
  const session = useAuth();

  //states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility toggle

  const handleAuth = async (e) => {
    e.preventDefault();
    // tells if signup option is choosen
    if (isSignUp) {
      // Updated to new API: signUp returns { data, error }
      const { data, error: SignupError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (SignupError) {
        console.error("Error signing up:", SignupError);
        return;
      }

      console.log("Sign up successful:", data);
      router.push("/TaskManager");
    } else {
      // Fixed: Use signInWithPassword instead of deprecated signIn
      // Updated response destructuring: { data, error }
      const { data, error: SignInError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

      if (SignInError) {
        console.error("Error signing in:", SignInError);
        return;
      }

      router.push("TaskManager");

      console.log("Sign in successful:", data);
    }
  };

  return (
    <div className="text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-12">
        <div className="w-1/2 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-10 shadow-xl">
          <div className="mb-10 text-center space-y-3">
            <span className="inline-flex items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
              {isSignUp ? "Get started" : "Welcome back"}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {isSignUp ? "Create an account" : "Sign in to continue"}
            </h1>
            <p className="text-sm text-zinc-400">
              {isSignUp
                ? "Enter your email and a secure password to join."
                : "Access your workspace with your registered credentials."}
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleAuth}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="auth-email"
                className="text-sm font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600/30"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="auth-password"
                className="text-sm font-medium text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 pr-12 text-sm text-zinc-100 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600/30"
                  placeholder="••••••••"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye-off icon (hide)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0012 4.5c4.118 0 7.623 3.083 9.48 7.5a10.518 10.518 0 01-1.84 3.969m-6.84 1.646a3 3 0 01-5.196-3.309m-3.944.49a10.5 10.5 0 01-1.816-3.908c.1-.6.4-1.15.8-1.65m6.72 6.72l-.72-.72m0 0L12 12m0 0l.72.72m-.72-.72l.72.72"
                      />
                    </svg>
                  ) : (
                    // Eye icon (show)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-200/40"
            >
              {isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 py-4 text-sm text-zinc-400">
            <span>
              {isSignUp ? "Already have an account?" : "Need an account?"}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp((prev) => !prev)}
              className="font-semibold text-white transition hover:opacity-70"
            >
              {isSignUp ? "Sign in" : "Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

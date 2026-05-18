"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/notes");
    } catch (err) {
      setError("Cannot reach server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-stone-200 p-8">

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-800">NotesHub</h1>
          <p className="text-stone-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2.5 pr-16 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full py-2.5 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-5 text-center text-sm text-stone-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-stone-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

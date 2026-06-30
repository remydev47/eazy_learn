"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create your account.");
        setLoading(false);
        return;
      }
      // Account created — sign them in with the same credentials.
      const result = await signIn("credentials", {
        username: data.username,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        // Created but auto-login failed — send them to login.
        router.push("/login");
        return;
      }
      const callbackUrl =
        new URLSearchParams(window.location.search).get("callbackUrl") || "/dashboard/student";
      router.push(callbackUrl);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-[#1A6EF5]">KodeClass</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-6">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Start learning in minutes.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                <input
                  type="text" required value={form.firstname} onChange={update("firstname")}
                  autoComplete="given-name"
                  className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6EF5]/30 focus:border-[#1A6EF5]"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                <input
                  type="text" required value={form.lastname} onChange={update("lastname")}
                  autoComplete="family-name"
                  className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6EF5]/30 focus:border-[#1A6EF5]"
                  placeholder="Wanjiku"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email" required value={form.email} onChange={update("email")}
                autoComplete="email"
                className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6EF5]/30 focus:border-[#1A6EF5]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password" required value={form.password} onChange={update("password")}
                autoComplete="new-password" minLength={8}
                className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6EF5]/30 focus:border-[#1A6EF5]"
                placeholder="At least 8 characters"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1A6EF5] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

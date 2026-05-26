import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

interface LoginSearchParams {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

const ROLE_HOME: Record<string, string> = {
  admin: "/dashboard/admin",
  instructor: "/dashboard/instructor",
  student: "/dashboard/student",
};

export default async function LoginPage({ searchParams }: LoginSearchParams) {
  const { callbackUrl, error: errorParam } = await searchParams;

  // Already signed in? Bounce them to their dashboard.
  const session = await auth();
  if (session?.user) {
    redirect(callbackUrl || ROLE_HOME[session.user.role] || "/");
  }

  async function login(formData: FormData) {
    "use server";
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      // signIn() reads the credentials, calls our authorize() in lib/auth.ts,
      // sets the session cookie, then redirects.
      await signIn("credentials", {
        username,
        password,
        // Default redirect target. Middleware will further route by role.
        redirectTo: "/dashboard/student",
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/login?error=${err.type}`);
      }
      throw err;
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-[#FF510E]">EazyTech</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-6">Sign in to your account</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back. Enter your credentials below.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          {errorParam ? (
            <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
              {errorParam === "CredentialsSignin"
                ? "Invalid username or password."
                : "Something went wrong. Please try again."}
            </div>
          ) : null}

          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username or email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 focus:border-[#FF510E]"
                placeholder="student"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 focus:border-[#FF510E]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <a
              href={`${process.env.NEXT_PUBLIC_MOODLE_URL ?? ""}/login/signup.php`}
              className="font-semibold text-[#FF510E] hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo credentials: <code>student</code>/<code>Student123!</code> · <code>teacher</code>/<code>Teacher123!</code> · <code>admin</code>/<code>EzayAdmin123!</code>
        </p>
      </div>
    </main>
  );
}

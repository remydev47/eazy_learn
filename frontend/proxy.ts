// Protects /dashboard/* routes and enforces role-based section locks.
// Uses the Edge-safe authConfig (no Moodle client import here — that would
// blow up at Edge runtime).

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Skip Next internals and public assets. Auth checks happen inside the
  // authorized() callback in lib/auth.config.ts.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};

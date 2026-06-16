// Edge-compatible portion of the NextAuth config.
// Middleware/proxy runs at Edge and must not import Node-only modules (like the
// Moodle client, which uses `server-only`). The credentials Provider lives in
// lib/auth.ts; everything here is edge-safe pure-data manipulation.

import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "./moodle/types";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  instructor: "/dashboard/instructor",
  student: "/dashboard/student",
};

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  // Providers are injected in lib/auth.ts (Node runtime only).
  providers: [],
  callbacks: {
    // Runs on token creation (after authorize) and on every request to refresh.
    // Edge-safe — no I/O, just shuffling fields.
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: UserRole }).role;
        token.moodleId = (user as { moodleId: number }).moodleId;
      }
      return token;
    },
    // Copies the role/moodleId from the JWT onto the session object that pages
    // and middleware see via `auth()`.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as UserRole;
        session.user.moodleId = token.moodleId as number;
      }
      return session;
    },
    // Gate /dashboard/* and route by role.
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const isDashboard = path.startsWith("/dashboard");
      if (!isDashboard) return true;
      if (!auth?.user) return false; // not signed in → redirect to /login

      const role = auth.user.role as UserRole | undefined;
      if (!role) return true; // shouldn't happen, but don't loop

      // Admin can see everything.
      if (role === "admin") return true;

      // Admin already returned above, so any non-admin hitting /dashboard/admin
      // is redirected home. Instructor can see instructor/, student stays student-only.
      if (path.startsWith("/dashboard/admin")) {
        return Response.redirect(new URL(ROLE_HOME[role], request.nextUrl));
      }
      if (path.startsWith("/dashboard/instructor") && role !== "instructor") {
        return Response.redirect(new URL(ROLE_HOME[role], request.nextUrl));
      }
      if (path.startsWith("/dashboard/student") && role !== "student") {
        return Response.redirect(new URL(ROLE_HOME[role], request.nextUrl));
      }
      return true;
    },
  },
};

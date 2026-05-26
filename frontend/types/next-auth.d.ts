// Extend NextAuth's User/Session/JWT types with our custom fields.
import type { UserRole } from "@/lib/moodle/types";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: UserRole;
    moodleId: number;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role: UserRole;
      moodleId: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    moodleId: number;
  }
}

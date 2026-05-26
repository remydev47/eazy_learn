// Full NextAuth config — runs in the Node runtime (route handlers + server components).
// Edge-only callbacks live in lib/auth.config.ts so middleware can import them
// without pulling in the Moodle client (which is `server-only`).

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { authenticateWithMoodle } from "./moodle/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Moodle",
      credentials: {
        username: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!username || !password) return null;

        const result = await authenticateWithMoodle(username, password);
        if (!result) return null;

        // Returned shape becomes the `user` arg in the jwt callback (defined in auth.config.ts).
        return {
          id: String(result.user.id),
          name: result.user.fullname,
          email: result.user.email,
          role: result.role,
          moodleId: result.user.id,
        };
      },
    }),
  ],
});

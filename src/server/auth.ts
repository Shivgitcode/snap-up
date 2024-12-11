import { db } from "@/drizzle/db";
import { env } from "../../env";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT,
      clientSecret: env.GITHUB_SECRET,
    }),
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const findUser = await db
          .select()
          .from(users)
          .where(eq(users.name, credentials.username as string));
        if (!findUser) {
          throw new Error("user not found register first");
        }
        const isVerify = await bcrypt.compare(
          credentials.password as string,
          findUser[0].password as string
        );
        if (!isVerify) {
          throw new Error("Invalid credentials");
        }
        return findUser[0];
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
});

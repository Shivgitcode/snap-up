import { db } from "@/drizzle/db";
import { env } from "../../env";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"

export const { handlers, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        GithubProvider({
            clientId: env.GITHUB_CLIENT,
            clientSecret: env.GITHUB_SECRET

        })

    ],


})
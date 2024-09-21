import { env } from "../../env";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"

export const { handlers, auth } = NextAuth({
    providers: [
        GithubProvider({
            clientId: env.GITHUB_CLIENT,
            clientSecret: env.GITHUB_SECRET

        })

    ]

})
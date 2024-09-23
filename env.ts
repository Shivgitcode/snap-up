import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        GITHUB_CLIENT: z.string(),
        GITHUB_SECRET: z.string(),
        DB_URL: z.string().url()
    },
    client: {
        NEXT_PUBLIC_BASE_URL: z.string().url(),
    },
    runtimeEnv: {
        GITHUB_CLIENT: process.env.GITHUB_CLIENT,
        GITHUB_SECRET: process.env.GITHUB_SECRET,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        DB_URL: process.env.DB_URL
    },

});
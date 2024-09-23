import { defineConfig } from "drizzle-kit"
import { env } from "./env"

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dbCredentials: {
        url: env.DB_URL
    },
    verbose: true,
    strict: true,
})
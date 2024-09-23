import { neon } from "@neondatabase/serverless"
import { env } from "../../env"
import { drizzle } from "drizzle-orm/neon-http"

const client = neon(env.DB_URL)
export const db = drizzle(client, { logger: true });
import { Pool } from "@neondatabase/serverless";
import { env } from "../../env";
import { drizzle } from "drizzle-orm/neon-serverless";

const pool = new Pool({ connectionString: env.DB_URL });
export const db = drizzle(pool, { logger: true });

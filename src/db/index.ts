import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";
import * as schema from "./schema";

// Importing env here is deliberate: it validates the whole server environment at
// module load, so a missing variable fails the build instead of surfacing as a
// confusing runtime error. The previous dummy-localhost fallback hid exactly that.
const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });

import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from "drizzle-orm/neon-http/migrator";

neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString)
export const db = drizzle(sql);

migrate(db, { migrationsFolder: "drizzle" });

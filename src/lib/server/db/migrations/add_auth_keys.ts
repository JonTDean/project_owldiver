import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from "drizzle-orm";

export async function up(db: PostgresJsDatabase) {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS auth_keys (
      id TEXT PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      hashed_password TEXT
    )
  `);
}

export async function down(db: PostgresJsDatabase) {
  await db.execute(sql`
    DROP TABLE IF EXISTS auth_keys
  `);
} 
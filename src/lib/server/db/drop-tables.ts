import { config } from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env
config();

if (!process.env.DATABASE_ROOT_URL) {
  throw new Error('DATABASE_ROOT_URL is not set');
}

const rootConnection = postgres(process.env.DATABASE_ROOT_URL, {
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync(join(process.cwd(), 'certs', 'root.crt')),
    key: readFileSync(join(process.cwd(), 'certs', 'client.key')),
    cert: readFileSync(join(process.cwd(), 'certs', 'client.crt')),
  }
});

const db = drizzle(rootConnection);

async function dropTables() {
  try {
    await db.execute(sql`
      DROP TABLE IF EXISTS 
        mission_participants,
        missions,
        profiles,
        users,
        sessions,
        oauth_accounts,
        builds,
        build_votes,
        drizzle_migrations
      CASCADE;
    `);
    
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await rootConnection.end();
    process.exit(0);
  }
}

dropTables(); 
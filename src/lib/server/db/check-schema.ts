import { config } from 'dotenv';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

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
  

async function checkSchema() {
  try {
    const db = drizzle(rootConnection);
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'app' AND table_name = 'profiles'
      ORDER BY ordinal_position;
    `);
    
    console.log('Profiles table structure:');
    console.log(result);
  } catch (err) {
    console.error('Error checking schema:', err);
  }
}

checkSchema(); 
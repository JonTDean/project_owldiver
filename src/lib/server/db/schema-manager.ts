import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
};

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

export async function setupSchema() {
  try {
    log.info('Setting up database schemas...');

    // Create schemas
    await db.execute(sql`
      -- Create schemas if they don't exist
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE SCHEMA IF NOT EXISTS app;
      
      -- Revoke public schema usage from public
      REVOKE CREATE ON SCHEMA public FROM PUBLIC;
      REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
      
      -- Grant schema creation to owl_root (needed for migrations)
      GRANT CREATE ON SCHEMA auth TO owl_root;
      GRANT CREATE ON SCHEMA app TO owl_root;
      
      -- Set search_path for owl_root
      ALTER ROLE owl_root SET search_path TO auth, app, public;
      
      -- Set search_path for owl_user
      ALTER ROLE owl_user SET search_path TO auth, app, public;
    `);

    log.success('Database schemas setup completed!');
  } catch (error) {
    log.error('Error setting up database schemas:');
    console.error(error);
    throw error;
  } finally {
    await rootConnection.end();
  }
}

// ES modules entry point check
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSchema().catch((error) => {
    console.error('Failed to setup schemas:', error);
    process.exit(1);
  });
} 
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { config } from 'dotenv';

config();

if (!process.env.DATABASE_ROOT_URL) {
  throw new Error('DATABASE_ROOT_URL is not set');
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
};

const rootConnection = postgres(process.env.DATABASE_ROOT_URL, {
  ssl: {
    rejectUnauthorized: true,
    ca: readFileSync(join(process.cwd(), 'certs', 'root.crt')),
    key: readFileSync(join(process.cwd(), 'certs', 'client.key')),
    cert: readFileSync(join(process.cwd(), 'certs', 'client.crt')),
  }
});

async function resetDatabase() {
  const db = drizzle(rootConnection);

  try {
    log.info('Starting complete database reset...');

    // Get initial schema counts
    const initialCounts = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name IN ('auth', 'app')) as schemas,
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema IN ('auth', 'app')) as tables,
        (SELECT COUNT(*) FROM information_schema.table_constraints 
         WHERE constraint_schema IN ('auth', 'app') AND constraint_type = 'FOREIGN KEY') as foreign_keys
    `);

    log.info('Current database objects:');
    Object.entries(initialCounts[0]).forEach(([key, value]) => {
      log.step(`${key}: ${value}`);
    });

    // Drop and recreate schemas
    log.step('Dropping existing schemas...');
    await db.execute(sql`
      DROP SCHEMA IF EXISTS auth CASCADE;
      DROP SCHEMA IF EXISTS app CASCADE;
    `);

    log.step('Creating fresh schemas with permissions...');
    await db.execute(sql`
      -- Create schemas
      CREATE SCHEMA auth;
      CREATE SCHEMA app;
      
      -- Grant schema usage
      GRANT USAGE ON SCHEMA auth TO owl_user;
      GRANT USAGE ON SCHEMA app TO owl_user;
      
      -- Grant permissions to owl_root
      GRANT ALL ON SCHEMA auth TO owl_root;
      GRANT ALL ON SCHEMA app TO owl_root;
      
      -- Set search paths
      ALTER ROLE owl_root SET search_path TO auth, app, public;
      ALTER ROLE owl_user SET search_path TO auth, app, public;
      
      -- Set up default privileges
      ALTER DEFAULT PRIVILEGES FOR ROLE owl_root IN SCHEMA auth 
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO owl_user;
      ALTER DEFAULT PRIVILEGES FOR ROLE owl_root IN SCHEMA app 
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO owl_user;
      
      -- Grant sequence privileges
      ALTER DEFAULT PRIVILEGES FOR ROLE owl_root IN SCHEMA auth 
        GRANT USAGE ON SEQUENCES TO owl_user;
      ALTER DEFAULT PRIVILEGES FOR ROLE owl_root IN SCHEMA app 
        GRANT USAGE ON SEQUENCES TO owl_user;
    `);

    // Verify cleanup
    const finalCounts = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name IN ('auth', 'app')) as schemas,
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema IN ('auth', 'app')) as tables,
        (SELECT COUNT(*) FROM information_schema.table_constraints 
         WHERE constraint_schema IN ('auth', 'app') AND constraint_type = 'FOREIGN KEY') as foreign_keys
    `);

    log.success('Database reset completed successfully!');
    log.info('Final database state:');
    Object.entries(finalCounts[0]).forEach(([key, value]) => {
      const count = Number(value);
      if (count > 0 && key !== 'schemas') {
        log.warning(`${key}: ${count}`);
      } else {
        log.success(`${key}: ${count}`);
      }
    });

  } catch (error) {
    log.error('Error during database reset:');
    console.error(error);
    throw error;
  } finally {
    log.info('Closing database connection...');
    await rootConnection.end();
    log.success('Database connection closed');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase().catch((error) => {
    log.error('Fatal error during reset:');
    console.error(error);
    process.exit(1);
  });
} 
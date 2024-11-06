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

// Load environment variables
config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
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

export async function pushTables() {
  const db = drizzle(rootConnection);

  try {
    log.info('Creating tables...');

    // First, create schemas and set up permissions
    await db.execute(sql`
      -- Create schemas
      CREATE SCHEMA IF NOT EXISTS auth;
      CREATE SCHEMA IF NOT EXISTS app;
      
      -- Grant schema usage to owl_user
      GRANT USAGE ON SCHEMA auth TO owl_user;
      GRANT USAGE ON SCHEMA app TO owl_user;
      
      -- Set search path for both roles
      ALTER ROLE owl_root SET search_path TO auth, app, public;
      ALTER ROLE owl_user SET search_path TO auth, app, public;
    `);

    // Create auth schema tables first
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS auth.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS auth.sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        CONSTRAINT sessions_user_id_fkey 
          FOREIGN KEY (user_id) 
          REFERENCES auth.users(id) 
          ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
        token TEXT PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        revoked_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS auth.oauth_accounts (
        provider_id TEXT NOT NULL,
        provider_user_id TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TIMESTAMP WITH TIME ZONE,
        PRIMARY KEY (provider_id, provider_user_id)
      );
    `);

    // Create app schema tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS app.profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        rank VARCHAR(50) DEFAULT 'RECRUIT',
        security_clearance INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        thumbnail VARCHAR(50) DEFAULT '🎖️',
        steam_id VARCHAR(255),
        steam_username VARCHAR(255),
        psn_id VARCHAR(255),
        discord_id VARCHAR(255),
        join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS app.profile_rp (
        profile_id UUID PRIMARY KEY REFERENCES app.profiles(id) ON DELETE CASCADE,
        codename VARCHAR(255) UNIQUE,
        nationality VARCHAR(255),
        specialization VARCHAR(255),
        motivation TEXT,
        service_history TEXT,
        psych_profile TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS app.combat_stats (
        profile_id UUID PRIMARY KEY REFERENCES app.profiles(id) ON DELETE CASCADE,
        career_stats JSONB DEFAULT '{
          "enemy_kills": 0,
          "terminid_kills": 0,
          "automaton_kills": 0,
          "friendly_kills": 0,
          "grenade_kills": 0,
          "melee_kills": 0,
          "eagle_kills": 0,
          "deaths": 0,
          "shots_fired": 0,
          "shots_hit": 0,
          "orbitals_used": 0,
          "defensive_stratagems_used": 0,
          "eagle_stratagems_used": 0,
          "supply_stratagems_used": 0,
          "reinforce_stratagems_used": 0,
          "total_stratagems_used": 0,
          "successful_extractions": 0,
          "objectives_completed": 0,
          "missions_played": 0,
          "missions_won": 0,
          "in_mission_time": "00:00:00",
          "samples_collected": 0,
          "total_xp_earned": 0
        }'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS app.builds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        primary_weapon VARCHAR(255),
        secondary_weapon VARCHAR(255),
        stratagems TEXT[],
        perks TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS app.build_votes (
        build_id UUID REFERENCES app.builds(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        vote_type BOOLEAN,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (build_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS app.missions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        status VARCHAR(50) DEFAULT 'active',
        difficulty VARCHAR(50),
        max_participants INTEGER,
        current_participants INTEGER DEFAULT 0,
        start_time TIMESTAMP WITH TIME ZONE,
        end_time TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS app.mission_participants (
        mission_id UUID REFERENCES app.missions(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        profile_id UUID REFERENCES app.profiles(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'member',
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (mission_id, user_id)
      );

    `);

    // Grant permissions on all tables to owl_user
    await db.execute(sql`
      -- Grant permissions on all existing tables
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth TO owl_user;
      GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO owl_user;
      
      -- Grant permissions on future tables
      ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO owl_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO owl_user;
      
      -- Grant sequence permissions
      GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO owl_user;
      GRANT USAGE ON ALL SEQUENCES IN SCHEMA app TO owl_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT USAGE ON SEQUENCES TO owl_user;
      ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT USAGE ON SEQUENCES TO owl_user;
    `);

    log.success('Tables and permissions created successfully!');
  } catch (error) {
    log.error('Error creating tables:');
    console.error(error);
    throw error;
  } finally {
    await rootConnection.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  pushTables().catch((error) => {
    console.error('Failed to push tables:', error);
    process.exit(1);
  });
} 
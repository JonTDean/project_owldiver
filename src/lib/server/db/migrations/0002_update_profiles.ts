import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from "drizzle-orm";

export async function up(db: PostgresJsDatabase) {
  // Drop existing profiles table if it exists
  await db.execute(sql`DROP TABLE IF EXISTS profiles CASCADE`);

  // Create new profiles table with updated schema
  await db.execute(sql`
    CREATE TABLE profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      
      steam_id VARCHAR(255),
      steam_username VARCHAR(255),
      psn_id VARCHAR(255),
      discord_id VARCHAR(255),
      
      codename VARCHAR(255) NOT NULL,
      rank VARCHAR(50) DEFAULT 'RECRUIT',
      security_clearance INTEGER DEFAULT 1,
      status VARCHAR(50) DEFAULT 'ACTIVE',
      specialization VARCHAR(255),
      thumbnail VARCHAR(50) DEFAULT '🎖️',
      
      nationality VARCHAR(255),
      motivation TEXT,
      service_history TEXT,
      psych_profile TEXT,
      
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
      
      join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  await db.execute(sql`
    CREATE INDEX idx_profiles_user_id ON profiles(user_id);
    CREATE INDEX idx_profiles_steam_id ON profiles(steam_id);
    CREATE INDEX idx_profiles_psn_id ON profiles(psn_id);
    CREATE UNIQUE INDEX idx_profiles_codename ON profiles(codename);
  `);

  // Create trigger to update updated_at
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION update_profile_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_profiles_timestamp
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_profile_timestamp();
  `);
}

export async function down(db: PostgresJsDatabase) {
  await db.execute(sql`
    DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
    DROP FUNCTION IF EXISTS update_profile_timestamp();
    DROP TABLE IF EXISTS profiles CASCADE;
  `);
} 
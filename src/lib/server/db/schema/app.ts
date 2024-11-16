import { 
  pgSchema, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  integer, 
  boolean,
  primaryKey,
  jsonb,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './auth';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { CareerStats } from './types';

const appSchema = pgSchema('app');

// Core profile table
export const profiles = appSchema.table('profiles', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  
  // Basic info
  rank: varchar('rank', { length: 50 }).default('RECRUIT'),
  security_clearance: integer('security_clearance').default(1),
  status: varchar('status', { length: 50 }).default('ACTIVE'),
  thumbnail: varchar('thumbnail', { length: 50 }).default('🎖️'),
  avatar: text('avatar'),
   
  // Gaming accounts
  steam_id: varchar('steam_id', { length: 255 }),
  steam_username: varchar('steam_username', { length: 255 }),
  psn_id: varchar('psn_id', { length: 255 }),
  discord_id: varchar('discord_id', { length: 255 }),

  // Timestamps
  join_date: timestamp('join_date', { withTimezone: true }).defaultNow(),
  last_active: timestamp('last_active', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// RP information
export const profile_rp = appSchema.table('profile_rp', {
  profile_id: uuid('profile_id')
    .primaryKey()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  is_private: boolean('is_private').default(false),
  codename: varchar('codename', { length: 255 }).unique(),
  nationality: varchar('nationality', { length: 255 }),
  specialization: varchar('specialization', { length: 255 }),
  motivation: text('motivation'),
  service_history: text('service_history'),
  psych_profile: text('psych_profile'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Combat statistics
export const combat_stats = appSchema.table('combat_stats', {
  profile_id: uuid('profile_id')
    .primaryKey()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  career_stats: jsonb('career_stats').$type<CareerStats>(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Missions table
export const missions = appSchema.table('missions', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  created_by: uuid('created_by')
    .references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).default('active'),
  difficulty: varchar('difficulty', { length: 50 }),
  max_participants: integer('max_participants'),
  current_participants: integer('current_participants').default(0),
  start_time: timestamp('start_time', { withTimezone: true }),
  end_time: timestamp('end_time', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Mission participants table
export const mission_participants = appSchema.table(
  'mission_participants',
  {
    mission_id: uuid('mission_id')
      .references(() => missions.id, { onDelete: 'cascade' }),
    user_id: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    profile_id: uuid('profile_id')
      .references(() => profiles.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 50 }).default('member'),
    joined_at: timestamp('joined_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.mission_id, t.user_id] })
  })
);

// Loadouts table
export const loadouts = appSchema.table('loadouts', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  created_by: uuid('created_by')
    .references(() => users.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  
  // Weapons and Equipment
  primary_weapon: varchar('primary_weapon', { length: 255 }),
  secondary_weapon: varchar('secondary_weapon', { length: 255 }),
  accessory_weapon: varchar('accessory_weapon', { length: 255 }),
  helmet: varchar('helmet', { length: 255 }),
  body_armor: varchar('body_armor', { length: 255 }),
  cape: varchar('cape', { length: 255 }),
  
  // Stratagems (array of 5)
  stratagem_1: varchar('stratagem_1', { length: 255 }),
  stratagem_2: varchar('stratagem_2', { length: 255 }),
  stratagem_3: varchar('stratagem_3', { length: 255 }),
  stratagem_4: varchar('stratagem_4', { length: 255 }),
  stratagem_5: varchar('stratagem_5', { length: 255 }),
  
  // Mission Info
  recommended_planets: text('recommended_planets').array(),
  recommended_enemy: varchar('recommended_enemy', { length: 255 }),
  role_fulfilled: varchar('role_fulfilled', { length: 255 }),
  mission_booster: varchar('mission_booster', { length: 255 }),
  
  // Metrics
  upvotes: integer('upvotes').default(0),
  downvotes: integer('downvotes').default(0),
  
  // Timestamps
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Loadout votes table
export const loadout_votes = appSchema.table('loadout_votes', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  loadout_id: uuid('loadout_id')
    .notNull()
    .references(() => loadouts.id, { onDelete: 'cascade' }),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  upvote: boolean('upvote'),
  downvote: boolean('downvote'),
  rating: integer('rating').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  // Ensure a user can only vote once per loadout
  unique_vote: uniqueIndex('unique_loadout_vote_idx').on(table.loadout_id, table.user_id),
  // Add check constraint for rating range
  rating_check: sql`check (rating >= 1 AND rating <= 10)`
}));

// Zod schemas
export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export const insertMissionSchema = createInsertSchema(missions);
export const selectMissionSchema = createSelectSchema(missions);
export const insertProfileRPSchema = createInsertSchema(profile_rp);
export const selectProfileRPSchema = createSelectSchema(profile_rp);
export const insertCombatStatsSchema = createInsertSchema(combat_stats);
export const selectCombatStatsSchema = createSelectSchema(combat_stats);
export const insertLoadoutSchema = createInsertSchema(loadouts);
export const selectLoadoutSchema = createSelectSchema(loadouts);
export const insertLoadoutVoteSchema = createInsertSchema(loadout_votes);
export const selectLoadoutVoteSchema = createSelectSchema(loadout_votes); 
import { 
  pgSchema, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  integer, 
  boolean,
  primaryKey,
  jsonb
} from 'drizzle-orm/pg-core';
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

// Builds table
export const builds = appSchema.table('builds', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  created_by: uuid('created_by')
    .references(() => users.id, { onDelete: 'set null' }),
  primary_weapon: varchar('primary_weapon', { length: 255 }),
  secondary_weapon: varchar('secondary_weapon', { length: 255 }),
  stratagems: text('stratagems').array(),
  upvotes: integer('upvotes').default(0),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Build votes table
export const build_votes = appSchema.table(
  'build_votes',
  {
    build_id: uuid('build_id')
      .references(() => builds.id, { onDelete: 'cascade' }),
    user_id: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' }),
    vote_type: boolean('vote_type'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.build_id, t.user_id] })
  })
);

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

// Zod schemas
export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export const insertBuildSchema = createInsertSchema(builds);
export const selectBuildSchema = createSelectSchema(builds);
export const insertMissionSchema = createInsertSchema(missions);
export const selectMissionSchema = createSelectSchema(missions);
export const insertProfileRPSchema = createInsertSchema(profile_rp);
export const selectProfileRPSchema = createSelectSchema(profile_rp);
export const insertCombatStatsSchema = createInsertSchema(combat_stats);
export const selectCombatStatsSchema = createSelectSchema(combat_stats); 
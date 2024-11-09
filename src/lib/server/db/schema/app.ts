import { pgSchema, uuid, varchar, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './auth';

// Create the schema
const appSchema = pgSchema('app');

// Profiles table
export const profiles = appSchema.table('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rank: varchar('rank', { length: 50 }).notNull(),
  security_clearance: integer('security_clearance').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  avatar: text('avatar'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Combat stats table
export const combat_stats = appSchema.table('combat_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  profile_id: uuid('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  career_stats: jsonb('career_stats').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Add Zod schemas for type safety
export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);
export const insertCombatStatsSchema = createInsertSchema(combat_stats);
export const selectCombatStatsSchema = createSelectSchema(combat_stats);

// Add helper types
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type CombatStats = typeof combat_stats.$inferSelect;
export type NewCombatStats = typeof combat_stats.$inferInsert; 
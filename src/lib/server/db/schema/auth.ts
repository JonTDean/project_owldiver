import { pgSchema, uuid, varchar, text, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Create the schema
const authSchema = pgSchema('auth');

// Users table
export const users = authSchema.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  password_hash: varchar('password_hash', { length: 255 }),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  steam_id: varchar('steam_id', { length: 255 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  email_verified: boolean('email_verified').default(false),
}, (table) => {
  return {
    email_idx: uniqueIndex('users_email_unique').on(table.email),
  };
});

// Sessions table
export const sessions = authSchema.table('sessions', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
});

// Refresh tokens table
export const refresh_tokens = authSchema.table('refresh_tokens', {
  token: text('token').primaryKey().notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  revoked_at: timestamp('revoked_at', { withTimezone: true }),
});

// OAuth accounts table
export const oauth_accounts = authSchema.table('oauth_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 255 }).notNull(),
  provider_user_id: varchar('provider_user_id', { length: 255 }).notNull(),
  provider_username: varchar('provider_username', { length: 255 }),
  provider_avatar: text('provider_avatar'),
  access_token: text('access_token'),
  refresh_token: text('refresh_token'),
  token_type: varchar('token_type', { length: 255 }),
  scope: text('scope'),
  id_token: text('id_token'),
  expires_at: timestamp('expires_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  provider_user_unique: uniqueIndex('provider_user_unique_idx').on(
    table.provider,
    table.provider_user_id
  ),
}));

// Add OAuth provider enum type for type safety
export const OAuthProvider = {
  STEAM: 'steam',
  DISCORD: 'discord'
} as const;

export type OAuthProvider = typeof OAuthProvider[keyof typeof OAuthProvider];

// Add Zod schemas for type safety
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
export const insertOAuthAccountSchema = createInsertSchema(oauth_accounts);
export const selectOAuthAccountSchema = createSelectSchema(oauth_accounts);

// Add helper types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type OAuthAccount = typeof oauth_accounts.$inferSelect;
export type NewOAuthAccount = typeof oauth_accounts.$inferInsert; 
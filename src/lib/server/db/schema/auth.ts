import { pgSchema, uuid, varchar, text, boolean, timestamp, uniqueIndex, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Create the schema
const authSchema = pgSchema('auth');

// Users table
export const users = authSchema.table('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
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
  provider_id: text('provider_id').notNull(),
  provider_user_id: text('provider_user_id').notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  access_token: text('access_token').notNull(),
  refresh_token: text('refresh_token'),
  expires_at: timestamp('expires_at', { withTimezone: true }),
}, (table) => ({
  pk: primaryKey({ columns: [table.provider_id, table.provider_user_id] })
}));

// Steam accounts table
export const steam_accounts = authSchema.table('steam_accounts', {
  user_id: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  steam_id: varchar('steam_id', { length: 255 }).unique(),
  steam_username: varchar('steam_username', { length: 255 }),
  access_token: text('access_token'),
  refresh_token: text('refresh_token'),
  last_online: timestamp('last_online', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Zod schemas for type safety
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
import { pgTable, uuid, varchar, timestamp, boolean, text, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  last_login: timestamp("last_login", { withTimezone: true }),
  is_active: boolean("is_active").default(true),
  role: varchar("role", { length: 50 }).default("user"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const player_profiles = pgTable("player_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  discord_id: varchar("discord_id", { length: 255 }),
  steam_id: varchar("steam_id", { length: 255 }),
  rank: varchar("rank", { length: 50 }).default("recruit"),
  missions_completed: integer("missions_completed").default(0),
  team_kills: integer("team_kills").default(0),
  total_playtime: integer("total_playtime").default(0), // in minutes
  join_date: timestamp("join_date", { withTimezone: true }).defaultNow(),
  last_active: timestamp("last_active", { withTimezone: true }).defaultNow(),
  bio: text("bio"),
  achievements: text("achievements").array(),
});

// Add this new table for Lucia auth
export const keys = pgTable("auth_keys", {
  id: text("id").primaryKey(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  hashed_password: text("hashed_password")
});
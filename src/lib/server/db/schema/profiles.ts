import { pgTable, uuid, varchar, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from './users';

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  discordId: varchar("discord_id", { length: 255 }),
  steamId: varchar("steam_id", { length: 255 }),
  rank: varchar("rank", { length: 50 }).default("recruit"),
  missionsCompleted: integer("missions_completed").default(0),
  teamKills: integer("team_kills").default(0),
  totalPlaytime: integer("total_playtime").default(0),
  joinDate: timestamp("join_date", { withTimezone: true }).defaultNow(),
  lastActive: timestamp("last_active", { withTimezone: true }).defaultNow(),
  bio: text("bio"),
  achievements: text("achievements").array().default([]),
}); 
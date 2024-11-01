import { pgTable, uuid, varchar, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from './users';
import { profiles } from './profiles';

export const missions = pgTable("missions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by").references(() => users.id),
  status: varchar("status", { length: 50 }).default("active"),
  difficulty: varchar("difficulty", { length: 50 }),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const missionParticipants = pgTable(
  "mission_participants",
  {
    missionId: uuid("mission_id").references(() => missions.id, { onDelete: 'cascade' }),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }),
    profileId: uuid("profile_id").references(() => profiles.id, { onDelete: 'cascade' }),
    role: varchar("role", { length: 50 }).default("member"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.missionId, table.userId] })
  })
);
import { pgTable, uuid, varchar, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from './users';

export const missions = pgTable("missions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("active"),
  difficulty: varchar("difficulty", { length: 50 }),
  max_participants: integer("max_participants"),
  current_participants: integer("current_participants").default(0),
  start_time: timestamp("start_time", { withTimezone: true }),
  end_time: timestamp("end_time", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const mission_participants = pgTable(
  "mission_participants",
  {
    mission_id: uuid("mission_id").references(() => missions.id, { onDelete: 'cascade' }),
    user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }),
    role: varchar("role", { length: 50 }).default("member"),
    joined_at: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mission_id, table.user_id] })
  })
);
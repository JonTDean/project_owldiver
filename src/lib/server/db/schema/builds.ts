import { pgTable, uuid, varchar, text, integer, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { users } from './users';

export const builds = pgTable("builds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  created_by: uuid("created_by").references(() => users.id),
  primary_weapon: varchar("primary_weapon", { length: 255 }),
  secondary_weapon: varchar("secondary_weapon", { length: 255 }),
  stratagems: text("stratagems").array(),
  upvotes: integer("upvotes").default(0),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const build_votes = pgTable(
  "build_votes",
  {
    build_id: uuid("build_id").references(() => builds.id, { onDelete: 'cascade' }),
    user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }),
    vote_type: boolean("vote_type"),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.build_id, table.user_id] })
  })
);
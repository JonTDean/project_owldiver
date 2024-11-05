import { pgTable, uuid, varchar, timestamp, text, integer, json } from "drizzle-orm/pg-core";
import { users } from './users';

export type CareerStats = {
  // Combat Stats
  enemy_kills: number;
  terminid_kills: number;
  automaton_kills: number;
  friendly_kills: number;
  grenade_kills: number;
  melee_kills: number;
  eagle_kills: number;
  deaths: number;
  shots_fired: number;
  shots_hit: number;
  
  // Stratagem Usage
  orbitals_used: number;
  defensive_stratagems_used: number;
  eagle_stratagems_used: number;
  supply_stratagems_used: number;
  reinforce_stratagems_used: number;
  total_stratagems_used: number;
  
  // Mission Stats
  successful_extractions: number;
  objectives_completed: number;
  missions_played: number;
  missions_won: number;
  in_mission_time: string;
  samples_collected: number;
  total_xp_earned: number;
};

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  // Platform IDs
  steamId: varchar("steam_id", { length: 255 }),
  steamUsername: varchar("steam_username", { length: 255 }),
  psnId: varchar("psn_id", { length: 255 }),
  discordId: varchar("discord_id", { length: 255 }),
  
  // Owldiver Details
  codename: varchar("codename", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 50 }).default("RECRUIT"),
  securityClearance: integer("security_clearance").default(1),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  specialization: varchar("specialization", { length: 255 }),
  thumbnail: varchar("thumbnail", { length: 50 }).default("🎖️"),
  
  // Background Information
  nationality: varchar("nationality", { length: 255 }),
  motivation: text("motivation"),
  serviceHistory: text("service_history"),
  psychProfile: text("psych_profile"),
  
  // Career Statistics stored as JSON
  careerStats: json("career_stats").$type<CareerStats>().default({
    enemy_kills: 0,
    terminid_kills: 0,
    automaton_kills: 0,
    friendly_kills: 0,
    grenade_kills: 0,
    melee_kills: 0,
    eagle_kills: 0,
    deaths: 0,
    shots_fired: 0,
    shots_hit: 0,
    orbitals_used: 0,
    defensive_stratagems_used: 0,
    eagle_stratagems_used: 0,
    supply_stratagems_used: 0,
    reinforce_stratagems_used: 0,
    total_stratagems_used: 0,
    successful_extractions: 0,
    objectives_completed: 0,
    missions_played: 0,
    missions_won: 0,
    in_mission_time: "00:00:00",
    samples_collected: 0,
    total_xp_earned: 0
  }),
  
  // Timestamps
  joinDate: timestamp("join_date", { withTimezone: true }).defaultNow(),
  lastActive: timestamp("last_active", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}); 
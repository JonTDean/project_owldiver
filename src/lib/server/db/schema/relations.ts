import { relations } from 'drizzle-orm';
import { users } from './users';
import { sessions } from './sessions';
import { oauth_accounts } from './oauth_accounts';
import { builds, build_votes } from './builds';
import { missions, missionParticipants } from './missions';
import { profiles } from './profiles';

export const usersRelations = relations(users, ({ many, one }) => ({
  sessions: many(sessions),
  oauthAccounts: many(oauth_accounts),
  builds: many(builds),
  buildVotes: many(build_votes),
  missionParticipations: many(missionParticipants),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  missionParticipations: many(missionParticipants),
}));

export const missionsRelations = relations(missions, ({ many, one }) => ({
  participants: many(missionParticipants),
  creator: one(users, {
    fields: [missions.createdBy],
    references: [users.id],
  }),
}));

export const missionParticipantsRelations = relations(missionParticipants, ({ one }) => ({
  mission: one(missions, {
    fields: [missionParticipants.missionId],
    references: [missions.id],
  }),
  user: one(users, {
    fields: [missionParticipants.userId],
    references: [users.id],
  }),
  profile: one(profiles, {
    fields: [missionParticipants.profileId],
    references: [profiles.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const oauthAccountsRelations = relations(oauth_accounts, ({ one }) => ({
  user: one(users, {
    fields: [oauth_accounts.user_id],
    references: [users.id],
  }),
}));

export const buildsRelations = relations(builds, ({ one, many }) => ({
  creator: one(users, {
    fields: [builds.created_by],
    references: [users.id],
  }),
  votes: many(build_votes),
}));

export const buildVotesRelations = relations(build_votes, ({ one }) => ({
  build: one(builds, {
    fields: [build_votes.build_id],
    references: [builds.id],
  }),
  user: one(users, {
    fields: [build_votes.user_id],
    references: [users.id],
  }),
}));
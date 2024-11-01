import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from './users';

export const oauth_accounts = pgTable('oauth_accounts', {
  provider_id: text('provider_id').notNull(),
  provider_user_id: text('provider_user_id').notNull(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  access_token: text('access_token').notNull(),
  refresh_token: text('refresh_token'),
  expires_at: timestamp('expires_at', { withTimezone: true }),
  
  // Add primary key constraint
  id: uuid('id').primaryKey().defaultRandom()
}); 
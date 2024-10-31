import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { dev } from "$app/environment";
import { getDb } from "$lib/server/db";
import { sessions, users } from "$lib/server/db/schema";

// Get the admin db instance for auth operations
const db = getDb(true);

// Create the adapter with the correct table structure
const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      email: attributes.email,
      role: attributes.role,
      is_active: attributes.is_active
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      email: string;
      role: string;
      is_active: boolean;
    };
  }
}

export type Auth = typeof lucia;
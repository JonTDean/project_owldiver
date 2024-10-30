import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

export async function load() {
  const db = getDb(); // Use regular user connection
  try {
    const allUsers = await db.select().from(users);
    return { success: true, users: allUsers };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Database operation failed:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
} 
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/dashboard');
  }

  const db = getDb(); // Use regular user connection
  try {
    const allUsers = await db.select().from(users);
    return { 
      success: true, 
      users: allUsers,
      user: null
    };
  } catch (error: any) {
    console.error('Database operation failed:', error);
    return { 
      success: false, 
      error: error?.message || 'Unknown error',
      user: null
    };
  }
};
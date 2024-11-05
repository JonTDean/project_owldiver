import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import db from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const session = locals.session;

  if (!session) {
    throw redirect(303, '/auth/login');
  }

  // Fetch the user data using the session's user_id
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user_id)
  });

  if (!user) {
    throw redirect(303, '/auth/login');
  }

  return {
    user
  };
}; 
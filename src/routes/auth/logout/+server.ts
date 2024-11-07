import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invalidateSession } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ cookies, locals }) => {
  const sessionToken = cookies.get('session_token');
  
  if (sessionToken) {
    await invalidateSession(sessionToken);
  }
  
  cookies.delete('session_token', { path: '/' });
  cookies.delete('refresh_token', { path: '/' });
  
  throw redirect(303, '/');
}; 
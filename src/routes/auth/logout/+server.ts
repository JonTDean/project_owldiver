import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { invalidateSession } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ cookies }) => {
  const token = cookies.get('session_token');
  
  if (token) {
    await invalidateSession(token);
    cookies.delete('session_token', { path: '/' });
  }
  
  throw redirect(302, '/');
}; 
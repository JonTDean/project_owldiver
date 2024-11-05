import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { refreshSession } from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ cookies }) => {
  const refreshToken = cookies.get('refresh_token');

  if (!refreshToken) {
    throw error(401, 'No refresh token provided');
  }

  const session = await refreshSession(refreshToken);
  
  if (!session) {
    cookies.delete('session_token', { path: '/' });
    cookies.delete('refresh_token', { path: '/' });
    throw error(401, 'Invalid refresh token');
  }

  // Set new cookies
  cookies.set('session_token', session.accessToken, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15 // 15 minutes
  });

  cookies.set('refresh_token', session.refreshToken, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });

  return json({ success: true });
}; 
import { discord } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  const [url, state] = await discord.getAuthorizationUrl();
  
  // Store state in a cookie for validation
  cookies.set('discord_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10 // 10 minutes
  });
  
  throw redirect(302, url.toString());
}; 
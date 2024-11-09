import { steamAuth } from '$lib/server/auth/steam';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { linkOAuthAccount } from '$lib/server/auth/oauth';
import { createSession } from '$lib/server/auth/session';

export const GET: RequestHandler = async ({ url, cookies }) => {
  try {
    const steamUserData = await steamAuth.authenticate(url.searchParams);
    
    if (!steamUserData) {
      throw error(500, 'Failed to get Steam user data');
    }

    const user = await linkOAuthAccount({
      provider: 'steam',
      providerId: steamUserData.steamid,
      username: steamUserData.personaname,
      avatar: steamUserData.avatarfull
    });

    if (!user) {
      throw error(500, 'Failed to create or link account');
    }

    const { accessToken, refreshToken } = await createSession(user.id);

    // Set cookies with proper options
    cookies.set('session_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    cookies.set('refresh_token', refreshToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    // Use Response object for more control
    return new Response(null, {
      status: 303, // Using 303 See Other for POST-Redirect-GET pattern
      headers: {
        Location: '/dashboard',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    console.error('Steam authentication error:', err);
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, 'Authentication failed');
  }
}; 
import { error, redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { users, oauth_accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateSessionToken, createSession } from '$lib/server/auth/session';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('discord_oauth_state');

  if (!code || !state || !storedState || state !== storedState) {
    throw error(400, 'Invalid OAuth callback');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID ?? '',
        client_secret: process.env.DISCORD_CLIENT_SECRET ?? '',
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.PUBLIC_SITE_URL}/auth/discord/callback`
      })
    });

    const tokens = await tokenResponse.json();

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`
      }
    });

    const discordUser = await userResponse.json();

    const db = getDb(true);

    // Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(users.email, discordUser.email)
    });

    if (!user) {
      // Create new user
      const [newUser] = await db.insert(users)
        .values({
          username: discordUser.username,
          email: discordUser.email,
          password_hash: '',
          role: 'user',
          is_active: true
        })
        .returning();
      user = newUser;
    }

    // Update or create OAuth account
    await db
      .insert(oauth_accounts)
      .values({
        provider_id: 'discord',
        provider_user_id: discordUser.id,
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000)
      })
      .onConflictDoUpdate({
        target: [oauth_accounts.provider_id, oauth_accounts.provider_user_id],
        set: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: new Date(Date.now() + tokens.expires_in * 1000)
        }
      });

    // Create session
    const sessionToken = generateSessionToken();
    await createSession(sessionToken, user.id);

    cookies.delete('discord_oauth_state', { path: '/' });
    cookies.set('session_token', sessionToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    throw redirect(302, '/dashboard');
  } catch (err) {
    console.error('Discord OAuth error:', err);
    throw error(500, 'Authentication failed');
  }
}; 
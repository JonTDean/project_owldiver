import { getDb } from '$lib/server/db';
import { oauth_accounts } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function refreshDiscordToken(userId: string, providerId: string) {
  const db = getDb(true);
  
  // Get the current tokens
  const account = await db.query.oauth_accounts.findFirst({
    where: and(
      eq(oauth_accounts.user_id, userId),
      eq(oauth_accounts.provider_id, providerId)
    )
  });

  if (!account?.refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID ?? '',
        client_secret: process.env.DISCORD_CLIENT_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: account.refresh_token
      })
    });

    const tokens = await response.json();

    // Update tokens in database
    await db.update(oauth_accounts)
      .set({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000)
      })
      .where(and(
        eq(oauth_accounts.user_id, userId),
        eq(oauth_accounts.provider_id, providerId)
      ));

    return tokens.access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
} 
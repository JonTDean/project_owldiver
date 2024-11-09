import { getDb } from '$lib/server/db';
import { users, oauth_accounts, type OAuthProvider } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { NewUser } from '$lib/server/db/schema';

interface OAuthUserData {
  provider: OAuthProvider;
  providerId: string;
  username: string;
  email?: string;
  avatar?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export async function linkOAuthAccount(userData: OAuthUserData) {
  const db = getDb();

  // Start a transaction
  return await db.transaction(async (tx) => {
    // Check if OAuth account already exists
    const existingOAuth = await tx.query.oauth_accounts.findFirst({
      where: and(
        eq(oauth_accounts.provider, userData.provider),
        eq(oauth_accounts.provider_user_id, userData.providerId)
      )
    });

    if (existingOAuth) {
      // Update existing OAuth account
      await tx.update(oauth_accounts)
        .set({
          provider_username: userData.username,
          provider_avatar: userData.avatar,
          access_token: userData.accessToken,
          refresh_token: userData.refreshToken,
          expires_at: userData.expiresAt,
          updated_at: new Date()
        })
        .where(eq(oauth_accounts.id, existingOAuth.id));

      // Get and return the associated user
      const user = await tx.query.users.findFirst({
        where: eq(users.id, existingOAuth.user_id)
      });
      return user;
    }

    // Prepare new user data
    const newUserData: NewUser = {
      username: userData.username,
      avatar: userData.avatar || null,
      role: 'user',
      // Add Steam-specific data if it's a Steam login
      ...(userData.provider === 'steam' && {
        steam_id: userData.providerId
      })
    };

    // Create new user
    const [user] = await tx.insert(users)
      .values(newUserData)
      .returning();

    // Create OAuth account
    await tx.insert(oauth_accounts)
      .values({
        user_id: user.id,
        provider: userData.provider,
        provider_user_id: userData.providerId,
        provider_username: userData.username,
        provider_avatar: userData.avatar,
        access_token: userData.accessToken || null,
        refresh_token: userData.refreshToken || null,
        expires_at: userData.expiresAt || null
      });

    return user;
  });
} 
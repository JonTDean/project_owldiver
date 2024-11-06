import { getDb } from '$lib/server/db';
import { sessions, users } from '$lib/server/db/schema/auth';
import { refresh_tokens } from '$lib/server/db/schema/auth';
import { and, eq, gt, isNull } from 'drizzle-orm';
import type { AuthUser } from '$lib/types';
import { generateRandomString, generateUUID } from '$lib/utils';

export function generateSessionToken(): string {
  return generateUUID();
}

export function generateRefreshToken(): string {
  return generateRandomString(64);
}

export async function createSession(userId: string) {
  console.log('🔄 Starting session creation for user:', userId);
  try {
    const db = getDb();
    
    // Generate tokens
    console.log('🔑 Generating tokens...');
    const accessToken = generateUUID();
    const refreshToken = generateUUID();
    
    // Calculate expiration times
    const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    
    console.log('💾 Storing session in database...');
    // Create session
    await db.insert(sessions).values({
      id: accessToken,
      user_id: userId,
      expires_at: accessTokenExpiry
    });
    
    console.log('💾 Storing refresh token in database...');
    // Create refresh token
    await db.insert(refresh_tokens).values({
      token: refreshToken,
      user_id: userId,
      expires_at: refreshTokenExpiry
    });
    
    console.log('✅ Session creation complete');
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('❌ Error creating session:', error);
    throw error;
  }
}

export async function refreshSession(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  const db = getDb(true);

  // Find and validate refresh token
  const tokenRecord = await db.query.refresh_tokens.findFirst({
    where: (rt) => and(
      eq(rt.token, refreshToken),
      isNull(rt.revoked_at),
      gt(rt.expires_at, new Date())
    )
  });

  if (!tokenRecord) {
    return null;
  }

  // Get the user
  const user = await db.query.users.findFirst({
    where: eq(users.id, tokenRecord.user_id)
  });

  if (!user) {
    return null;
  }

  // Revoke old refresh token
  await db.update(refresh_tokens)
    .set({ revoked_at: new Date() })
    .where(eq(refresh_tokens.token, refreshToken));

  // Create new session and refresh token
  return createSession(user.id);
}

export async function validateSessionToken(token: string): Promise<{ user: AuthUser } | null> {
  const db = getDb(true);
  
  try {
    const session = await db.query.sessions.findFirst({
      where: (fields) => and(
        eq(fields.id, token),
        gt(fields.expires_at, new Date())
      )
    });

    if (!session) {
      return null;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user_id),
      columns: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      return null;
    }

    return { user };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const db = getDb(true);
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllUserSessions(user_id: string): Promise<void> {
  const db = getDb(true);
  await db.delete(sessions).where(eq(sessions.user_id, user_id));
  await db.update(refresh_tokens)
    .set({ revoked_at: new Date() })
    .where(eq(refresh_tokens.user_id, user_id));
} 
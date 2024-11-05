import { getDb } from '$lib/server/db';
import { sessions, users } from '$lib/server/db/schema';
import { refresh_tokens } from '$lib/server/db/schema/refresh_tokens';
import { and, eq, gt, isNull } from 'drizzle-orm';
import type { User } from '$lib/types';
import { generateRandomString, generateUUID } from '$lib/utils';

const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export function generateSessionToken(): string {
  return generateUUID();
}

export function generateRefreshToken(): string {
  return generateRandomString(64);
}

export async function createSession(userId: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const db = getDb(true);
  const accessToken = generateSessionToken();
  const refreshToken = generateRefreshToken();

  // Create session
  await db.insert(sessions).values({
    id: accessToken,
    userId: userId,
    expiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY)
  });

  // Create refresh token
  await db.insert(refresh_tokens).values({
    token: refreshToken,
    userId: userId,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
  });

  return { accessToken, refreshToken };
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
      isNull(rt.revokedAt),
      gt(rt.expiresAt, new Date())
    )
  });

  if (!tokenRecord) {
    return null;
  }

  // Get the user
  const user = await db.query.users.findFirst({
    where: eq(users.id, tokenRecord.userId)
  });

  if (!user) {
    return null;
  }

  // Revoke old refresh token
  await db.update(refresh_tokens)
    .set({ revokedAt: new Date() })
    .where(eq(refresh_tokens.token, refreshToken));

  // Create new session and refresh token
  return createSession(user.id);
}

export async function validateSessionToken(token: string): Promise<{ user: User } | null> {
  const db = getDb(true);
  
  try {
    const session = await db.query.sessions.findFirst({
      where: (fields) => and(
        eq(fields.id, token),
        gt(fields.expiresAt, new Date())
      )
    });

    if (!session) {
      return null;
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.userId)
    });

    if (!user) {
      return null;
    }

    return { user: user as User };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const db = getDb(true);
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  const db = getDb(true);
  await db.delete(sessions).where(eq(sessions.userId, userId));
  await db.update(refresh_tokens)
    .set({ revokedAt: new Date() })
    .where(eq(refresh_tokens.userId, userId));
} 
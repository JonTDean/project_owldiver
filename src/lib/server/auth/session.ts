import { getDb } from '$lib/server/db';
import { sessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { User } from '$lib/types';

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}

export async function createSession(token: string, userId: string): Promise<void> {
  const db = getDb(true);
  await db.insert(sessions).values({
    id: token,
    userId: userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
  });
}

export async function validateSessionToken(token: string): Promise<{ user: User } | null> {
  const db = getDb(true);
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, token),
    with: {
      user: true
    }
  });

  if (!session || new Date() > session.expiresAt) {
    return null;
  }

  return { user: session.user as User };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const db = getDb(true);
  await db.delete(sessions).where(eq(sessions.id, sessionId));
} 
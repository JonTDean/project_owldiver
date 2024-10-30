import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { getDb } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { Handle } from '@sveltejs/kit';

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const db = getDb();

export const sessionCookieName = 'auth-session';

function generateSessionToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export type Session = typeof schema.sessions.$inferSelect;

export async function createSession(userId: string): Promise<Session> {
	const token = generateSessionToken();
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		user_id: userId,                    // Changed from userId
		expires_at: new Date(Date.now() + DAY_IN_MS * 30),  // Changed from expiresAt
		created_at: new Date()              // Changed from createdAt
	};
	await db.insert(schema.sessions).values(session);
	return session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId));
}

export async function validateSession(sessionId: string) {
	const [result] = await db
		.select({
			user: { id: schema.users.id, username: schema.users.username },
			session: schema.sessions
		})
		.from(schema.sessions)
		.innerJoin(schema.users, eq(schema.sessions.user_id, schema.users.id))  // Changed from userId
		.where(eq(schema.sessions.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expires_at.getTime();  // Changed from expiresAt
	if (sessionExpired) {
		await db.delete(schema.sessions).where(eq(schema.sessions.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expires_at.getTime() - DAY_IN_MS * 15;  // Changed from expiresAt
	if (renewSession) {
		session.expires_at = new Date(Date.now() + DAY_IN_MS * 30);  // Changed from expiresAt
		await db
			.update(schema.sessions)
			.set({ expires_at: session.expires_at })  // Changed from expiresAt
			.where(eq(schema.sessions.id, session.id));
	}

	return { session, user };
}

export const handleAuth: Handle = async ({ event, resolve }) => {
    // Your auth handling logic here
    return await resolve(event);
};

export type SessionValidationResult = Awaited<ReturnType<typeof validateSession>>;
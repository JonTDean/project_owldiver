import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { generateSessionToken, createSession } from '$lib/server/auth/session';

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
      return fail(400, { message: 'Invalid input' });
    }

    try {
      const db = getDb(true);

      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (!user?.password_hash) {
        return fail(400, { message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return fail(400, { message: 'Invalid credentials' });
      }

      const token = generateSessionToken();
      await createSession(token, user.id);

      cookies.set('session_token', token, { 
        path: '/', 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      throw redirect(302, '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      return fail(500, { message: 'An error occurred during login' });
    }
  }
} satisfies Actions;
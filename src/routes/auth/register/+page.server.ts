import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import * as bcrypt from 'bcrypt';
import { generateSessionToken, createSession } from '$lib/server/auth/session';

interface ActionData {
  success: boolean;
  message: string;
}

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');

    if (!username || !email || !password || 
        typeof username !== 'string' || 
        typeof email !== 'string' || 
        typeof password !== 'string') {
      return fail(400, {
        success: false,
        message: 'All fields are required'
      } satisfies ActionData);
    }

    try {
      const db = getDb(true);

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email)
      });

      if (existingUser) {
        return fail(400, {
          success: false,
          message: 'Email already registered'
        } satisfies ActionData);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [newUser] = await db.insert(users)
        .values({
          username,
          email,
          password_hash: hashedPassword,
          role: 'user',
          is_active: true
        })
        .returning();

      // Create session
      const token = generateSessionToken();
      await createSession(token, newUser.id);

      // Set session cookie
      cookies.set('session_token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      throw redirect(303, '/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      return fail(500, {
        success: false,
        message: 'An error occurred during registration'
      } satisfies ActionData);
    }
  }
} satisfies Actions;
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import * as bcrypt from 'bcrypt';
import { createSession } from '$lib/server/auth/session';
import { generateUUID } from '$lib/utils';

interface ActionData {
  success: boolean;
  message: string;
}

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/dashboard');
  }
  return {};
};

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

    const db = getDb(true);

    try {
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

      // Create user with UUID
      const userId = generateUUID();
      const [newUser] = await db.insert(users)
        .values({
          id: userId,
          username,
          email,
          password_hash: hashedPassword,
          role: 'user',
          is_active: true
        })
        .returning();

      // Create session
      const { accessToken, refreshToken } = await createSession(newUser.id);

      // Set session cookies
      cookies.set('session_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 15 // 15 minutes
      });

      cookies.set('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return {
        success: true,
        message: 'Registration successful'
      };
    } catch (err) {
      console.error('Registration error:', err);
      return fail(500, {
        success: false,
        message: 'An error occurred during registration'
      } satisfies ActionData);
    }
  }
} satisfies Actions;
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import * as bcrypt from 'bcrypt';
import { createSession } from '$lib/server/auth/session';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/dashboard');
  }
  return {};
};

export const actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const identifier = formData.get('identifier');
    const password = formData.get('password');

    console.log('Login attempt:', { identifier });

    try {
      if (!identifier || !password) {
        console.log('Missing credentials');
        return fail(400, { 
          message: 'MISSING CREDENTIALS - ALL FIELDS ARE REQUIRED' 
        });
      }

      if (typeof identifier !== 'string' || typeof password !== 'string') {
        console.log('Invalid input format');
        return fail(400, { 
          message: 'INVALID INPUT FORMAT - PLEASE TRY AGAIN' 
        });
      }

      const db = getDb(true);

      const user = await db.query.users.findFirst({
        where: (users, { or, eq }) => or(
          eq(users.email, identifier.toLowerCase().trim()),
          eq(users.username, identifier.toLowerCase().trim())
        )
      });

      console.log('User found:', !!user);

      if (!user?.password_hash) {
        return fail(400, { 
          message: 'INVALID CREDENTIALS - USER NOT FOUND IN DATABASE' 
        });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      console.log('Password valid:', validPassword);

      if (!validPassword) {
        return fail(400, { 
          message: 'INVALID CREDENTIALS - INCORRECT PASSWORD' 
        });
      }

      const { accessToken, refreshToken } = await createSession(user.id);

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

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      return fail(500, {
        message: 'AN UNEXPECTED ERROR OCCURRED - PLEASE TRY AGAIN'
      });
    }
  }
} satisfies Actions;
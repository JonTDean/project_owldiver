import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import * as bcrypt from 'bcrypt';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) return { user: null };

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    }
  };
};

export const actions = {
  updateProfile: async ({ request, locals }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');

    if (!username || !email) {
      return fail(400, { 
        type: 'profile',
        message: 'MISSING REQUIRED FIELDS - OPERATION ABORTED' 
      });
    }

    try {
      const db = getDb(true);
      await db.update(users)
        .set({ 
          username: username.toString().toLowerCase(),
          email: email.toString().toLowerCase()
        })
        .where(eq(users.id, locals.user!.id));

      return { type: 'profile', success: true };
    } catch (error) {
      return fail(500, { 
        type: 'profile',
        message: 'UPDATE OPERATION FAILED - PLEASE TRY AGAIN' 
      });
    }
  },

  updatePassword: async ({ request, locals }) => {
    const formData = await request.formData();
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { 
        type: 'password',
        message: 'ALL SECURITY FIELDS REQUIRED - OPERATION ABORTED' 
      });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { 
        type: 'password',
        message: 'NEW SECURITY KEYS DO NOT MATCH - VERIFICATION FAILED' 
      });
    }

    try {
      const db = getDb(true);
      const user = await db.query.users.findFirst({
        where: eq(users.id, locals.user!.id)
      });

      if (!user?.password_hash) {
        return fail(400, { 
          type: 'password',
          message: 'USER AUTHENTICATION FAILED - OPERATION ABORTED' 
        });
      }

      const validPassword = await bcrypt.compare(
        currentPassword.toString(),
        user.password_hash
      );

      if (!validPassword) {
        return fail(400, { 
          type: 'password',
          message: 'CURRENT SECURITY KEY INVALID - ACCESS DENIED' 
        });
      }

      const newPasswordHash = await bcrypt.hash(newPassword.toString(), 10);
      await db.update(users)
        .set({ password_hash: newPasswordHash })
        .where(eq(users.id, locals.user!.id));

      return { type: 'password', success: true };
    } catch (error) {
      return fail(500, { 
        type: 'password',
        message: 'SECURITY UPDATE FAILED - PLEASE TRY AGAIN' 
      });
    }
  }
} satisfies Actions; 
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import * as bcrypt from 'bcrypt';
import { createSession } from '$lib/server/auth/session';
import { generateUUID } from '$lib/utils';
import { profiles } from '$lib/server/db/schema';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  codename: string;
  steamId?: string;
  steamUsername?: string;
  nationality: string;
  motivation: string;
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
    
    // Extract and validate form data
    const data: RegisterFormData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      codename: formData.get('codename') as string,
      steamId: formData.get('steamId') as string || undefined,
      steamUsername: formData.get('steamUsername') as string || undefined,
      nationality: formData.get('nationality') as string,
      motivation: formData.get('motivation') as string,
    };

    // Validate required fields
    if (!data.username || !data.email || !data.password || !data.codename || !data.nationality) {
      return fail(400, {
        success: false,
        message: 'Required fields are missing'
      });
    }

    const db = getDb(true);

    try {
      // Check if user or codename already exists
      const [existingUser, existingProfile] = await Promise.all([
        db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, data.email)
        }),
        db.query.profiles.findFirst({
          where: (profiles, { eq }) => eq(profiles.codename, data.codename)
        })
      ]);

      if (existingUser) {
        return fail(400, {
          success: false,
          message: 'Email already registered'
        });
      }

      if (existingProfile) {
        return fail(400, {
          success: false,
          message: 'Codename already taken'
        });
      }

      // Start transaction
      return await db.transaction(async (tx) => {
        // Create user
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const userId = generateUUID();
        
        const [newUser] = await tx.insert(users)
          .values({
            id: userId,
            username: data.username,
            email: data.email,
            password_hash: hashedPassword,
            role: 'user',
            is_active: true
          })
          .returning();

        // Create profile
        await tx.insert(profiles).values({
          userId: newUser.id,
          codename: data.codename,
          steamId: data.steamId,
          steamUsername: data.steamUsername,
          nationality: data.nationality,
          motivation: data.motivation,
          rank: 'RECRUIT',
          securityClearance: 1,
          status: 'ACTIVE',
          specialization: 'NONE',
          careerStats: {
            enemy_kills: 0,
            terminid_kills: 0,
            automaton_kills: 0,
            friendly_kills: 0,
            grenade_kills: 0,
            melee_kills: 0,
            eagle_kills: 0,
            deaths: 0,
            shots_fired: 0,
            shots_hit: 0,
            orbitals_used: 0,
            defensive_stratagems_used: 0,
            eagle_stratagems_used: 0,
            supply_stratagems_used: 0,
            reinforce_stratagems_used: 0,
            total_stratagems_used: 0,
            successful_extractions: 0,
            objectives_completed: 0,
            missions_played: 0,
            missions_won: 0,
            in_mission_time: "00:00:00",
            samples_collected: 0,
            total_xp_earned: 0
          }
        });

        // Create session
        const { accessToken, refreshToken } = await createSession(newUser.id);

        // Set cookies
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
      });

    } catch (err) {
      console.error('Registration error:', err);
      return fail(500, {
        success: false,
        message: 'An error occurred during registration'
      });
    }
  }
} satisfies Actions;
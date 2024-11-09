import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema/auth';
import { profiles, combat_stats } from '$lib/server/db/schema/app';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createSession } from '$lib/server/auth/session';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const db = getDb();
    
    try {
      const formData = await request.formData();
      const data = {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string
      };

      // Check if user exists
      const email = data.email.toLowerCase();
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
        columns: {
          id: true,
          email: true
        }
      });

      if (existingUser) {
        return fail(400, {
          type: 'failure',
          data: {
            message: 'OPERATIVE ALREADY EXISTS IN DATABASE'
          }
        });
      }

      // Create user and related data in transaction
      const result = await db.transaction(async (tx) => {
        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        // Create user - note we're not setting avatar field
        const [newUser] = await tx.insert(users)
          .values({
            username: data.username,
            email: email,
            password_hash: hashedPassword,
            role: 'user'
            // avatar field will be null by default
          })
          .returning({
            id: users.id,
            username: users.username,
            email: users.email,
            role: users.role
          });

        if (!newUser?.id) {
          throw new Error('Failed to create user');
        }

        // Create profile with no avatar
        const [profile] = await tx.insert(profiles)
          .values({
            user_id: newUser.id,
            rank: 'RECRUIT',
            security_clearance: 1,
            status: 'ACTIVE',
            avatar: null, // Default avatar or null
          })
          .returning();

        // Create combat stats with correct schema
        await tx.insert(combat_stats)
          .values({
            profile_id: profile.id,
            career_stats: {
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

        return newUser;
      });

      // Create session and set cookies
      const { accessToken, refreshToken } = await createSession(result.id);

      // Set cookies
      cookies.set('session_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 15 // 15 minutes
      });

      cookies.set('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      // Return success instead of throwing redirect
      return {
        type: 'success',
        data: {
          flash: {
            type: 'success',
            message: 'ENLISTMENT SUCCESSFUL - WELCOME TO THE HELLDIVERS'
          }
        }
      };

    } catch (error) {
      console.error('❌ Registration error:', error);
      return fail(500, {
        type: 'error',
        data: {
          flash: {
            type: 'error',
            message: 'REGISTRATION FAILED'
          }
        }
      });
    }
  }
};
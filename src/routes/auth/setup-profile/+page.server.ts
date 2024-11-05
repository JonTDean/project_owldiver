import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDb } from '$lib/server/db';
import { profiles } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect if not logged in
  if (!locals.user) {
    throw redirect(302, '/auth/login');
  }

  // Check if profile already exists
  const db = getDb();
  const existingProfile = await db.query.profiles.findFirst({
    where: (profiles, { eq }) => eq(profiles.userId, locals.user.id)
  });

  if (existingProfile) {
    throw redirect(302, '/dashboard');
  }

  return {};
};

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, {
        success: false,
        message: 'Unauthorized'
      });
    }

    const formData = await request.formData();
    const codename = formData.get('codename') as string;
    const nationality = formData.get('nationality') as string;
    const motivation = formData.get('motivation') as string;

    if (!codename || !nationality || !motivation) {
      return fail(400, {
        success: false,
        message: 'All fields are required'
      });
    }

    const db = getDb();

    try {
      // Check if codename is taken
      const existingCodename = await db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.codename, codename)
      });

      if (existingCodename) {
        return fail(400, {
          success: false,
          message: 'Codename already taken'
        });
      }

      // Create profile
      await db.insert(profiles).values({
        userId: locals.user.id,
        codename,
        nationality,
        motivation,
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

      return {
        success: true,
        message: 'Profile created successfully'
      };
    } catch (err) {
      console.error('Profile creation error:', err);
      return fail(500, {
        success: false,
        message: 'An error occurred while creating your profile'
      });
    }
  }
} satisfies Actions; 
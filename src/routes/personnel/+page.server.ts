import { getDb } from '$lib/server/db';
import { profiles, profile_rp, combat_stats } from '$lib/server/db/schema/app';
import { eq, isNull, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const db = getDb();
    
    // Fetch all public profiles with their related data
    const personnel = await db
      .select({
        profile: profiles,
        rp: profile_rp,
        stats: combat_stats
      })
      .from(profiles)
      .leftJoin(profile_rp, eq(profiles.id, profile_rp.profile_id))
      .leftJoin(combat_stats, eq(profiles.id, combat_stats.profile_id))
      .where(
        or(
          isNull(profile_rp.is_private),
          eq(profile_rp.is_private, false)
        )
      );

    console.log('Personnel count:', personnel.length);

    return {
      personnel,
      user: locals.user
    };
  } catch (error) {
    console.error('Error loading personnel data:', error);
    // Return empty data instead of throwing
    return {
      personnel: [],
      user: locals.user
    };
  }
}; 

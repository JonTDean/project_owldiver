import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Add any server-side data loading here
  return {
    user: locals.user
  };
}; 
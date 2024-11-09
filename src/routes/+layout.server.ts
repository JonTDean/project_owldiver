import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  // Simply return the user from locals, which is already set by hooks.server.ts
  return {
    user: locals.user || null
  };
}; 
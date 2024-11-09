import { steamAuth } from '$lib/server/auth/steam';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const redirectUrl = steamAuth.getURLRedirect();
  
  throw redirect(302, redirectUrl);
};
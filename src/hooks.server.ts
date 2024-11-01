import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth/session';

export const handle = (async ({ event, resolve }) => {
  const token = event.cookies.get('session_token');
  
  if (token) {
    const session = await validateSessionToken(token);
    if (session) {
      event.locals.user = session.user;
    } else {
      event.cookies.delete('session_token', { path: '/' });
    }
  }

  return resolve(event, {
    transformPageChunk: ({ html }) => html
  });
}) satisfies Handle;
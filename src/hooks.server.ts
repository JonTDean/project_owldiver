import type { Handle } from '@sveltejs/kit';
import { validateSessionToken, refreshSession } from '$lib/server/auth/session';

// Define all route types
const AUTH_ROUTES = ['/auth/login', '/auth/register'];
const OAUTH_ROUTES = [
  '/auth/steam/login',
  '/auth/steam/callback',
  '/auth/discord/login',
  '/auth/discord/callback'
];
const PUBLIC_ROUTES = ['/about', '/', '/debug'];
const LANDING_PAGE = '/';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get('session_token');
  const refreshToken = event.cookies.get('refresh_token');
  const path = event.url.pathname;

  // First, handle session validation and refresh
  if (sessionToken) {
    try {
      const session = await validateSessionToken(sessionToken);
      
      if (session) {
        event.locals.user = session.user;
      } else if (refreshToken) {
        const newTokens = await refreshSession(refreshToken);
        
        if (newTokens) {
          event.cookies.set('session_token', newTokens.accessToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15 // 15 minutes
          });

          event.cookies.set('refresh_token', newTokens.refreshToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30 // 30 days
          });

          const newSession = await validateSessionToken(newTokens.accessToken);
          if (newSession) {
            event.locals.user = newSession.user;
          } else {
            handleInvalidSession(event);
          }
        } else {
          handleInvalidSession(event);
        }
      } else {
        handleInvalidSession(event);
      }
    } catch (error) {
      console.error('Session error:', error);
      handleInvalidSession(event);
    }
  }

  // Then, handle routing logic
  try {
    // If user is authenticated and trying to access auth routes or landing
    if (event.locals.user) {
      if ([...AUTH_ROUTES, LANDING_PAGE].includes(path)) {
        return Response.redirect(new URL('/dashboard', event.url));
      }
    }
    // If user is not authenticated and trying to access protected routes
    else if (!isPublicRoute(path)) {
      return Response.redirect(new URL('/auth/login', event.url));
    }

    return await resolve(event);
  } catch (error) {
    console.error('Route handling error:', error);
    return await resolve(event);
  }
};

// Helper function to handle invalid sessions
function handleInvalidSession(event: any) {
  event.cookies.delete('session_token', { path: '/' });
  event.cookies.delete('refresh_token', { path: '/' });
  event.locals.user = undefined;
}

// Helper function to check if a route is public
function isPublicRoute(path: string): boolean {
  // Check if the path matches any OAuth route exactly
  if (OAUTH_ROUTES.includes(path)) {
    return true;
  }
  
  // Check if the path starts with any OAuth route prefix
  if (OAUTH_ROUTES.some(route => path.startsWith(route))) {
    return true;
  }

  // Check other public routes
  return path === LANDING_PAGE || 
         AUTH_ROUTES.includes(path) || 
         PUBLIC_ROUTES.includes(path);
}
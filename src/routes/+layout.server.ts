import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { validateSessionToken } from '$lib/server/auth/session';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const sessionToken = cookies.get('session_token');
  console.log('Layout load - checking session:', { 
    hasToken: !!sessionToken,
    path: url.pathname 
  });
  
  const isAuthenticated = sessionToken ? await validateSessionToken(sessionToken) : null;
  console.log('Authentication result:', { 
    isAuthenticated: !!isAuthenticated,
    user: isAuthenticated?.user?.username 
  });

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/register', '/auth/login', '/about', '/'];
  const isPublicRoute = publicRoutes.includes(url.pathname);

  // Auth routes that should redirect to dashboard if authenticated
  const authRoutes = ['/auth/register', '/auth/login', '/'];
  const isAuthRoute = authRoutes.includes(url.pathname);

  if (isAuthenticated) {
    // Redirect auth routes to dashboard if authenticated
    if (isAuthRoute) {
      throw redirect(302, '/dashboard');
    }
    // Return auth data to all routes
    return {
      user: isAuthenticated.user
    };
  } else {
    // Redirect to login if not authenticated and not a public route
    if (!isPublicRoute) {
      throw redirect(302, '/auth/login');
    }
    return {
      user: null
    };
  }
}; 
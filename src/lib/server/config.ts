import { env } from '$env/dynamic/private';

if (!env.STEAM_API_KEY) {
  throw new Error('STEAM_API_KEY is required in environment variables');
}

export const config = {
  steam: {
    apiKey: env.STEAM_API_KEY,
    realm: env.NODE_ENV === 'production' 
      ? 'https://owldivers.jontdean.com'
      : 'http://localhost:5173',
    returnUrl: env.NODE_ENV === 'production'
      ? 'https://owldivers.jontdean.com/auth/steam/callback'
      : 'http://localhost:5173/auth/steam/callback'
  }
} as const; 
import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleAuth } from '$lib/server/auth';

// Create a sequence of handlers
export const handle: Handle = sequence(handleAuth);
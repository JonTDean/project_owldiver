import { env } from '$env/dynamic/private';

// Validate and export environment variables
export const DATABASE_CLIENT_URL = env.DATABASE_CLIENT_URL ?? process.env.DATABASE_CLIENT_URL;
export const DATABASE_ROOT_URL = env.DATABASE_ROOT_URL ?? process.env.DATABASE_ROOT_URL;

if (!DATABASE_CLIENT_URL || !DATABASE_ROOT_URL) {
    throw new Error('Database environment variables are not properly configured');
}
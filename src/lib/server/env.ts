import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
config({ path: join(process.cwd(), '.env') });

// Helper function to get required env variables
function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

// Database URLs
export const DATABASE_CLIENT_URL = requireEnv('DATABASE_CLIENT_URL');
export const DATABASE_ROOT_URL = requireEnv('DATABASE_ROOT_URL');

// SSL Certificates
export const POSTGRES_CA_CERT = requireEnv('PGSSLROOTCERT');
export const POSTGRES_CLIENT_KEY = requireEnv('PGSSLKEY');
export const POSTGRES_CLIENT_CERT = requireEnv('PGSSLCERT');
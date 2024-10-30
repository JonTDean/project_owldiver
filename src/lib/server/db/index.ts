import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { DATABASE_CLIENT_URL, DATABASE_ROOT_URL } from '../env';

// Initialize connections using imported environment variables
const clientConnection = postgres(DATABASE_CLIENT_URL);
const rootConnection = postgres(DATABASE_ROOT_URL);

const db = drizzle(clientConnection, { schema });
const adminDb = drizzle(rootConnection, { schema });

export function getDb(useAdmin = false) {
    return useAdmin ? adminDb : db;
}

// Export the default instance
export default db;
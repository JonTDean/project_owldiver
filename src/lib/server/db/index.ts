import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { readFileSync } from 'fs';
import { 
  DATABASE_CLIENT_URL, 
  DATABASE_ROOT_URL,
  POSTGRES_CA_CERT,
  POSTGRES_CLIENT_KEY,
  POSTGRES_CLIENT_CERT
} from '../env';

// SSL configuration
const sslConfig = {
  rejectUnauthorized: true,
  ca: readFileSync(POSTGRES_CA_CERT),
  key: readFileSync(POSTGRES_CLIENT_KEY),
  cert: readFileSync(POSTGRES_CLIENT_CERT),
};

// Initialize connections using imported environment variables
const clientConnection = postgres(DATABASE_CLIENT_URL, {
  max: 1,
  ssl: sslConfig
});

const rootConnection = postgres(DATABASE_ROOT_URL, {
  max: 1,
  ssl: sslConfig
});

const db = drizzle(clientConnection, { schema });
const adminDb = drizzle(rootConnection, { schema });

export function getDb(useAdmin = false) {
  return useAdmin ? adminDb : db;
}

// Export the default instance
export default db;
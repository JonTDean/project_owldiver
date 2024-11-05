import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { 
  DATABASE_ROOT_URL,
  POSTGRES_CA_CERT,
  POSTGRES_CLIENT_KEY,
  POSTGRES_CLIENT_CERT
} from '../env';

// Get the current file's directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..', '..', '..', '..');

// SSL configuration
const sslConfig = {
  rejectUnauthorized: true,
  ca: readFileSync(POSTGRES_CA_CERT),
  key: readFileSync(POSTGRES_CLIENT_KEY),
  cert: readFileSync(POSTGRES_CLIENT_CERT),
};

async function setupPermissions() {
  const rootConnection = postgres(DATABASE_ROOT_URL, {
    max: 1,
    ssl: sslConfig
  });

  try {
    const sql = readFileSync(
      join(projectRoot, 'src', 'lib', 'server', 'db', 'migrations', 'grant_permissions.sql'),
      'utf8'
    );

    // Update the grant permissions SQL to use the correct user
    const updatedSql = sql.replace(/owl_client/g, 'owl_user');
    
    await rootConnection.unsafe(updatedSql);
    console.log('Permissions granted successfully');
  } catch (error) {
    console.error('Error granting permissions:', error);
    throw error;
  } finally {
    await rootConnection.end();
  }
}

setupPermissions().catch((error) => {
  console.error('Failed to setup permissions:', error);
  process.exit(1);
}); 
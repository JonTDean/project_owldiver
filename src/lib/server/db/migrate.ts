import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { DATABASE_ROOT_URL } from '../env';
import fs from 'fs';
import path from 'path';

// Use the same SSL config as your main db connection
const migrationClient = postgres(DATABASE_ROOT_URL, {
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'root.crt')).toString(),
    key: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'client.key')).toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), 'certs', 'client.crt')).toString(),
  },
  max: 1
});

async function main() {
  const db = drizzle(migrationClient);
  
  console.log('Running migrations...');
  
  await migrate(db, {
    migrationsFolder: 'src/lib/server/db/migrations'
  });
  
  console.log('Migrations completed!');
  
  await migrationClient.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed!');
  console.error(err);
  process.exit(1);
}); 
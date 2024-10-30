import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

if (!process.env.DATABASE_ROOT_URL) throw new Error('DATABASE_ROOT_URL is not set');

export default defineConfig({
  schema: './src/lib/server/db/schema/*.ts',
  dbCredentials: {
    url: process.env.DATABASE_ROOT_URL,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.resolve(__dirname, 'certs', 'root.crt')).toString(),
      key: fs.readFileSync(path.resolve(__dirname, 'certs', 'client.key')).toString(),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'client.crt')).toString(),
    }
  },

  verbose: true,
  strict: true,
  dialect: 'postgresql'
});

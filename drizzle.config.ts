import { defineConfig } from 'drizzle-kit';
import path from 'path';

// Base connection details
const host = '192.168.1.180';
const port = '32170';
const database = 'owldivers_db';
const user = 'owl_root';
const password = '8LMCtwkbkMa8E67MSA2PqdP0PD9PsIRyibaWKyh4FEX1EChcrOizdEiRHzSwpd81';

// Get certificate paths
const certPath = path.resolve(__dirname, 'certs', 'client.crt');
const keyPath = path.resolve(__dirname, 'certs', 'client.key');
const caPath = path.resolve(__dirname, 'certs', 'root.crt');

// Construct the URL with all SSL parameters
const connectionURL = `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=require&sslcert=${certPath}&sslkey=${keyPath}&sslrootcert=${caPath}`;

export default defineConfig({
  schema: './src/lib/server/db/schema/*.ts',
  out: './src/lib/server/db/migrations', 
  dbCredentials: {
    url: connectionURL,
  },
  verbose: true,
  strict: true,
  dialect: 'postgresql'
});

import { defineConfig, loadEnv } from "vite";
import { sveltekit } from '@sveltejs/kit/vite';
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [sveltekit()],
    server: {
      fs: {
        allow: ['.']
      }
    },
    resolve: {
      alias: {
        $lib: path.resolve('./src/lib')
      }
    },
    // Inject env variables
    define: {
      'process.env.DATABASE_CLIENT_URL': JSON.stringify(env.DATABASE_CLIENT_URL),
      'process.env.DATABASE_ROOT_URL': JSON.stringify(env.DATABASE_ROOT_URL)
    },
    ssr: {
      noExternal: ['lucia', '@lucia-auth/oauth']
    }
  };
});
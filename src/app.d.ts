/// <reference types="@auth/sveltekit" />
declare global {
	namespace App {
		interface Locals {
			auth: import('@auth/core').Session;
			user: import("$lib/server/auth").SessionValidationResult["user"];
			session: import("$lib/server/auth").SessionValidationResult["session"];
		}
	}
	namespace NodeJS {
		interface ProcessEnv {
			GITHUB_CLIENT_ID: string;
			GITHUB_CLIENT_SECRET: string;
			AUTH_SECRET: string;
			DATABASE_CLIENT_URL: string;
			DATABASE_ROOT_URL: string;
		}
	}
}

export {};

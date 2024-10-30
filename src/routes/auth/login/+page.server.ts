// import { fail, redirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }: RequestEvent) => {
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        console.log("username", username);
        console.log("password", password);

        console.log("locals", locals);

        // Add authentication logic here
        // Remove this comment and unused variables when you implement the logic
        
        return { success: true };
    }
} satisfies Actions;
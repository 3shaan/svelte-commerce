import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { registrationSchema } from "$lib/server/(auth)/registration/registration.schema";
import { redirect, type Actions } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";
import { APIError } from "better-auth/api";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        return redirect(302, '/dashboard');
    }
    const form = await superValidate(zod4(registrationSchema));
    return { form };
};

export const actions: Actions = {
	
	signUpEmail: async (event) => {

		const form = await superValidate(event.request, zod4(registrationSchema));

		if(!form.valid) {
			return fail(400, { form });
		}

		const { email, password, name } = form.data;

		try {
			await auth.api.signUpEmail({
				body: {
					email,
					password,
					name,
					callbackURL: '/auth/verification-success'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Registration failed' });
			}
			return fail(500, { message: 'Unexpected error' });
		}

		return redirect(302, '/dashboard');
	},
};


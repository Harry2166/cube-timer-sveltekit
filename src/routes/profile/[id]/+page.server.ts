import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions}  from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = async (event) => {
    const { fetch, params } = event;
    let userId = params.id 
    const solves = await db.select().from(table.solves).where(eq(table.solves.userId, userId));
    const navbar_stuff = await db.select().from(table.user).where(eq(table.user.id, userId));
    return {
        solves,
        navbar_stuff
    }
}

export const actions: Actions = {
	deleteTime: async (event) => {
		const data = await event.request.json();
        await db.delete(table.solves).where(eq(table.solves.solveId, data.solveId)); 
		return { success: true };
	},
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	},
};
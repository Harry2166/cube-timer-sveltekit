import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import * as auth from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
    const solves = await db.select().from(table.solves).where(eq(table.solves.userId, event.locals.user.id));
	return { user: event.locals.user };
};

export const actions: Actions = {
	updateSolvesDB: async (event) => {
		const data = await event.request.json();
		await db.insert(table.events).values({ id: data.event }).onConflictDoNothing()
		await db.insert(table.solves).values({ 
			scramble: data.scramble, 
			userId: data.user_id, 
			timeRecord: data.timeRecorded, 
			minutes: data.minutes, 
			seconds: data.seconds, 
			ms: data.ms, 
			event: data.event, 
			isDNF: 0, 
			isPlusTwo: 0
		});
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

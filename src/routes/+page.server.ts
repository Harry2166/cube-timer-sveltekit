import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	updateScrambleDB: async (event) => {
		const data = await event.request.json();
		await db.insert(table.events).values({ id: data.event }).onConflictDoNothing()
		await db.insert(table.solves).values({ scramble: data.scramble, userId: data.user_id, timeRecord: data.timeRecorded, time: data.time, event: data.event});
		return { success: true };
	}
};

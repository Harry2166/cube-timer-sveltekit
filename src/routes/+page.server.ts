import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq} from 'drizzle-orm';
import * as db_access from '$lib/server/db_access';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
    const solves = await db.select().from(table.solves).where(eq(table.solves.userId, event.locals.user.id));
	return { user: event.locals.user, solves: solves };
};

export const actions: Actions = {
	updateSolvesDB: async (event) => {
		return await db_access.updateSolvesDB(event)
	},
	getMostRecentSolve: async (event) => {
		return await db_access.getMostRecentSolve(event)
	},
	logout: async (event) => {
		return await db_access.logout(event)
	},
};

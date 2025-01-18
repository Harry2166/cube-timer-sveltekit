import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions}  from './$types';
import * as db_access from '$lib/server/db_access';

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
		return await db_access.deleteTime(event)
	},

	updateTime: async (event) => {
		return await db_access.updateTime(event)
	},
	
	logout: async (event) => {
		return await db_access.logout(event)
	},
};
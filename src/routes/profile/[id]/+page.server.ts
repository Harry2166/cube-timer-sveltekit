import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { Actions}  from './$types';

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
};
import {error} from '@sveltejs/kit'
import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

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
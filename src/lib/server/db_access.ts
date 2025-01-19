import { db} from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit'
import { eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
	
export async function updateSolvesDB (event: RequestEvent) {
    const data = await event.request.json();
    await db.insert(table.solves).values({
        solve_id: table.solves.solve_id.default,
        scramble: data.scramble, 
        userId: data.user_id, 
        timeRecord: new Date(data.timeRecorded), 
        minutes: data.minutes, 
        seconds: data.seconds, 
        ms: data.ms, 
        event: data.event, 
        isDNF: 0, 
        isPlusTwo: 0
    });
    return { success: true };
}
export async function getMostRecentSolve (event: RequestEvent) {
    const data = await event.request.json();
    const result = await db.select().from(table.solves).where(eq(table.solves.userId, data.user_id)).orderBy(desc(table.solves.timeRecord)).limit(1)
    const solve = result[0]
    return {
        userId: solve.userId,
        solveId: solve.solve_id,
        scramble: solve.scramble,
        minutes: solve.minutes,
        seconds: solve.seconds,
        ms: solve.ms,
        timeRecord: solve.timeRecord,
        event: solve.event,
        isPlusTwo: solve.isPlusTwo,
        isDNF: solve.isDNF,
    }
}

export async function logout (event: RequestEvent) {
    if (!event.locals.session) {
        return fail(401);
    }
    await auth.invalidateSession(event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, '/login');
}

export async function deleteTime (event: RequestEvent) {
	const data = await event.request.json();
    await db.delete(table.solves).where(eq(table.solves.solve_id, data.solveId)); 
    return { success: true };
}

export async function updateTime (event: RequestEvent) {
    const data = await event.request.json();
    await db.update(table.solves).set({isDNF: data.isDNF, isPlusTwo: data.isPlusTwo}).where(eq(table.solves.solve_id, data.solveId)); 
    return { success: true };
}

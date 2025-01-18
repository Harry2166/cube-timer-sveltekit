import { db} from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit'
import { eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
	
export async function updateSolvesDB (event: RequestEvent) {
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
}
export async function getMostRecentSolve (event: RequestEvent) {
    const data = await event.request.json();
    const result = await db.select().from(table.solves).where(eq(table.solves.userId, data.user_id)).orderBy(desc(table.solves.timeRecord)).limit(1)
    const solve = result[0]
    return {
        userId: solve.userId,
        solveId: solve.solveId,
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
    await db.delete(table.solves).where(eq(table.solves.solveId, data.solveId)); 
    return { success: true };
}

export async function updateTime (event: RequestEvent) {
    const data = await event.request.json();
    await db.update(table.solves).set({isDNF: data.isDNF, isPlusTwo: data.isPlusTwo}).where(eq(table.solves.solveId, data.solveId)); 
    return { success: true };
}

// updateAvg: async (event) => {
	// 	const data = await event.request.json();
	// 	const result = await db.select({
	// 		mo3Entry: table.user.highestMo3,
	// 		ao5Entry: table.user.highestAo5,
	// 		ao12Entry: table.user.highestAo12
	// 	}).from(table.user).where(eq(table.user.id, data.user_id))
	// 	let {mo3Entry, ao5Entry, ao12Entry} = result[0]

	// 	if (data.avgNumber == 3) {
	// 		mo3Entry = getNewAvg(mo3Entry, data.avg)
	// 	} else if (data.avgNumber == 5) {
	// 		ao5Entry = getNewAvg(ao5Entry, data.avg)
	// 	} else if (data.avgNumber == 12) {
	// 		ao12Entry = getNewAvg(ao12Entry, data.avg)
	// 	}
    //     await db.update(table.user).set({highestMo3: mo3Entry, highestAo5: ao5Entry, highestAo12: ao12Entry}).where(eq(table.user.id, data.user_id)); 
	// 	return { success: true };
	// },

    function getNewAvg(orig: number, new_: number) {
	if (orig == 0) {
		return new_
	}
	return Math.min(new_, orig)
}
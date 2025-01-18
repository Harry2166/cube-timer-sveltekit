import { db} from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { RequestEvent } from '@sveltejs/kit'
import { and, eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';

export type Solve = {
    solveId: number;
    scramble: string | null;
    userId: string;
    minutes: number;
    seconds: number;
    ms: number;
    timeRecord: number;
    event: string | null;
    isDNF: number;
    isPlusTwo: number;
}

export async function updateSolvesDB (event: RequestEvent) {
    const data = await event.request.json();
    await db.insert(table.events).values({ id: data.event }).onConflictDoNothing()
    await db.insert(table.highest_averages).values({ userid: data.user_id, eventid: data.event }).onConflictDoNothing()
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
    await newAverages(data.user_id, data.event)
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
    
    await db.delete(table.mo3).where(eq(data.solveId, table.mo3.solve1id)); 
    await db.delete(table.mo3).where(eq(data.solveId, table.mo3.solve2id)); 
    await db.delete(table.mo3).where(eq(data.solveId, table.mo3.solve3id));
    
    await db.delete(table.ao5).where(eq(data.solveId, table.ao5.solve1id)); 
    await db.delete(table.ao5).where(eq(data.solveId, table.ao5.solve2id)); 
    await db.delete(table.ao5).where(eq(data.solveId, table.ao5.solve3id)); 
    await db.delete(table.ao5).where(eq(data.solveId, table.ao5.solve4id)); 
    await db.delete(table.ao5).where(eq(data.solveId, table.ao5.solve5id)); 

    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve1id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve2id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve3id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve4id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve5id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve6id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve7id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve8id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve9id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve10id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve11id)); 
    await db.delete(table.ao12).where(eq(data.solveId, table.ao12.solve12id));
    await newAverages(data.user_id, data.event_id)
    return { success: true };
}

export async function updateTime (event: RequestEvent) {
    const data = await event.request.json();
    await db.update(table.solves).set({isDNF: data.isDNF, isPlusTwo: data.isPlusTwo}).where(eq(table.solves.solveId, data.solveId)); 
    return { success: true };
}

async function newAverages(userId: string, event_id: string) {
    const solvesOfUser = await db.select().from(table.solves).where(eq(table.solves.userId, userId));
    const convertedSolvesOfUser = convertToSolveTimes(solvesOfUser)
    const highestAveragesOfUser = await db.select({
        fastestMo3id: table.highest_averages.mo3id,
        fastestAo5id: table.highest_averages.ao5id,
        fastestAo12id: table.highest_averages.ao12id
    }).from(table.highest_averages).where(eq(table.highest_averages.userid, userId))
    
    const {fastestMo3id, fastestAo5id, fastestAo12id} = highestAveragesOfUser[0];
    let actualMo3 = 0
    let actualAo5 = 0
    let actualAo12 = 0

    if (fastestMo3id != null) {
        const Mo3Times = (await db.select().from(table.mo3).where(eq(table.mo3.id, fastestMo3id)))[0];
        let actualMo3Times = await getAllTimesOfSolveIds([Mo3Times.solve1id, Mo3Times.solve2id, Mo3Times.solve3id]) 
        actualMo3 = mean(actualMo3Times)
    }

    if (fastestAo5id != null) {
        const Ao5Times = (await db.select().from(table.ao5).where(eq(table.ao5.id, fastestAo5id)))[0];
        let actualAo5Times = await getAllTimesOfSolveIds([Ao5Times.solve1id, Ao5Times.solve2id, Ao5Times.solve3id, Ao5Times.solve4id, Ao5Times.solve5id]) 
        actualAo5 = mean(actualAo5Times)
    }

    if (fastestAo12id != null) {
        const Ao12Times = (await db.select().from(table.ao12).where(eq(table.ao12.id, fastestAo12id)))[0];
        let actualAo12Times = await getAllTimesOfSolveIds([
            Ao12Times.solve1id, 
            Ao12Times.solve2id, 
            Ao12Times.solve3id, 
            Ao12Times.solve4id, 
            Ao12Times.solve5id, 
            Ao12Times.solve6id,
            Ao12Times.solve7id,
            Ao12Times.solve8id,
            Ao12Times.solve9id,
            Ao12Times.solve10id, 
            Ao12Times.solve11id, 
            Ao12Times.solve12id
        ]) 
        actualAo12 = mean(actualAo12Times)
    }

    await db.insert(table.highest_averages).values({ userid: userId, eventid: event_id }).onConflictDoNothing()

    for (let i = 2; i < convertedSolvesOfUser.length; i++){
        let mo3 = mean(convertedSolvesOfUser.slice(i-2, i+1))
        let entry = (await db.insert(table.mo3).values({ 
            userid: userId, 
            eventid: event_id, 
            solve1id: solvesOfUser[i-2].solveId,
            solve2id: solvesOfUser[i-1].solveId,
            solve3id: solvesOfUser[i].solveId,
        }).onConflictDoNothing().returning({mo3id: table.mo3.id}))[0]
        let toInsert = getNewAvg(actualMo3, mo3)
        if (toInsert == mo3) {
            if (entry == null) {
                entry = (await db.select({mo3id: table.mo3.id}).from(table.mo3).where(and(eq(table.mo3.solve1id, solvesOfUser[i-2].solveId), eq(table.mo3.userid, userId))))[0]
            }
            await db.update(table.highest_averages).set({
                mo3id: entry.mo3id
            }).where(eq(table.highest_averages.userid, userId))
        }

        if (i >= 4) {
            let ao5 = mean(convertedSolvesOfUser.slice(i-4, i+1))
            let entry = (await db.insert(table.ao5).values({ 
                userid: userId, 
                eventid: event_id, 
                solve1id: solvesOfUser[i-4].solveId,
                solve2id: solvesOfUser[i-3].solveId,
                solve3id: solvesOfUser[i-2].solveId,
                solve4id: solvesOfUser[i-1].solveId,
                solve5id: solvesOfUser[i].solveId,
            }).onConflictDoNothing().returning({ao5id: table.ao5.id}))[0]
            let toInsert = getNewAvg(actualAo5, ao5)
            if (toInsert == ao5) {
                if (entry == null) {
                    entry = (await db.select({ao5id: table.ao5.id}).from(table.ao5).where(and(eq(table.ao5.solve1id, solvesOfUser[i-4].solveId), eq(table.ao5.userid, userId))))[0]
                }
                await db.update(table.highest_averages).set({
                    ao5id: entry.ao5id
                }).where(eq(table.highest_averages.userid, userId))
            }
        }

        if (i >= 11) {
            let ao12 = mean(convertedSolvesOfUser.slice(i-11, i+1))
            let entry = (await db.insert(table.ao12).values({ 
                userid: userId, 
                eventid: event_id, 
                solve1id: solvesOfUser[i-11].solveId,
                solve2id: solvesOfUser[i-10].solveId,
                solve3id: solvesOfUser[i-9].solveId,
                solve4id: solvesOfUser[i-8].solveId,
                solve5id: solvesOfUser[i-7].solveId,
                solve6id: solvesOfUser[i-6].solveId,
                solve7id: solvesOfUser[i-5].solveId,
                solve8id: solvesOfUser[i-4].solveId,
                solve9id: solvesOfUser[i-3].solveId,
                solve10id: solvesOfUser[i-2].solveId,
                solve11id: solvesOfUser[i-1].solveId,
                solve12id: solvesOfUser[i].solveId,
            }).onConflictDoNothing().returning({ao12id: table.ao12.id}))[0]
            let toInsert = getNewAvg(actualAo12, ao12)
            if (toInsert == ao12) {
                if (entry == null) {
                    entry = (await db.select({ao12id: table.ao12.id}).from(table.ao12).where(and(eq(table.ao12.solve1id, solvesOfUser[i-11].solveId), eq(table.ao12.userid, userId))))[0]
                }
                await db.update(table.highest_averages).set({
                    ao12id: entry.ao12id
                }).where(eq(table.highest_averages.userid, userId))
            }
        }
    }
}

function convertToSolveTimes (solves: Solve[]) {
    let arr: number[] = []
    for (let i = 0; i < solves.length; i++){
        arr.push(solves[i].minutes * 60000 + solves[i].seconds*1000 + solves[i].ms)
    }
    return arr
}

async function getAllTimesOfSolveIds(solves: number[]) {
    let arr = []
    for (let i = 0; i < solves.length; i++){
        let solveData = await db.select().from(table.solves).where(eq(table.solves.solveId, solves[i]))
        arr.push(solveData[0])
    }
    return convertToSolveTimes(arr)
}

function getNewAvg(orig: number, new_: number) {
	if (orig == 0) {
		return new_
	}
	return Math.min(new_, orig)
}

function mean(nums: number[]) {
    return sum(nums) / 3
}

function average(nums: number[]) {
    const maxValue = Math.max(...nums)
    const minValue = Math.min(...nums)
    const removedValues = nums.filter((num) => {
        return minValue < num && num < maxValue
    })

    return sum(removedValues) / removedValues.length

}

function sum(arr: number[]) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
    return sum
}

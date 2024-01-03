import Check from './types/check'
import { checks } from 'db/schema/checks'
import { db } from 'db'
import { and, eq } from 'drizzle-orm'
import {
    createCheckEvent,
    deleteEvent,
    updateEventTiming,
} from './cronicleClient'

type CheckDB = typeof checks.$inferSelect

export async function addCheck(
    userId: string,
    hour: number,
    minute: number,
): Promise<string | undefined> {
    const timeString = hour + ':' + minute
    const eventId = await createCheckEvent(hour, minute)
    if (eventId) {
        await db.insert(checks).values({
            guardedUserId: userId,
            time: timeString,
            checkId: eventId,
        })
        const state = await db
            .select()
            .from(checks)
            .where(eq(checks.checkId, eventId))
            .then((res) => !!res[0])

        if (state) {
            return eventId
        }
    }
    return undefined
}

export async function removeCheck(checkId: string, userId: string) {
    const res = await db
        .delete(checks)
        .where(
            and(eq(checks.checkId, checkId), eq(checks.guardedUserId, userId)),
        )
    if (res[0].affectedRows > 0) {
        return await deleteEvent(checkId)
    } else {
        return false
    }
}

export async function modifyCheck(
    checkId: string,
    hour: number,
    minute: number,
    userId: string,
) {
    const timeString = hour + ':' + minute
    const res = await db
        .update(checks)
        .set({ time: timeString })
        .where(
            and(eq(checks.checkId, checkId), eq(checks.guardedUserId, userId)),
        )
    if (res[0].affectedRows > 0) {
        return await updateEventTiming(checkId, hour, minute)
    } else {
        return false
    }
}

export async function getChecks(userId: string) {
    const result = await db.query.checks.findMany({
        where: eq(checks.guardedUserId, userId),
    })
    return toChecks(result)
}

/**
 * Converts a DB object to corresponding lib type
 * @param check
 */
export function toCheck(check: CheckDB): Check {
    const a = check.time.split(':')
    const hour = Number(a[0])
    if (hour >= 24 || hour < 0) {
        throw new Error(errors.INVALID_ARGUMENTS, {
            cause: 'Time field holds an hour value < 0 or >= 24',
        })
    }
    return {
        hour: hour,
        minute: Number(a[1]),
        checkId: check.checkId,
    }
}

export function toChecks(checks: CheckDB[]): Check[] {
    const results: Check[] = []
    for (const check of checks) {
        results.push(toCheck(check))
    }
    return results
}

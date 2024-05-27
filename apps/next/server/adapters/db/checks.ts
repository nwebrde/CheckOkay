import {db} from "db";
import {and, eq} from "drizzle-orm";
import {checks} from "db/schema/checks";
import {ChecksController} from "../../entities/checks/ChecksController";
import {Check} from "../../entities/checks/Check";
import {Hour, Minute} from "app/lib/types/time";

type CheckDB = typeof checks.$inferSelect

export const getChecks = async (userId: string) => {
    const result = await db.query.checks.findMany({
        where: eq(checks.guardedUserId, userId),
    })
    const checksController = toChecksController(result);

    return checksController.checks;
}

/**
 * Returns the checkId if successfull, false otherwise
 * @param userId
 * @param hour
 * @param minute
 */
export const addCheck = async (userId: string, hour: Hour, minute: Minute) => {
    const timeString = hour + ':' + minute
    const res = await db.insert(checks).values({
        guardedUserId: userId,
        time: timeString,
    })

    return res[0].affectedRows > 0 ? res[0].insertId : false
}

export const removeCheck = async (userId: string, checkId: number) => {
    const res = await db
    .delete(checks)
    .where(
        and(eq(checks.id, checkId), eq(checks.guardedUserId, userId)),
    )

    return res[0].affectedRows > 0
}

export const modifyCheck = async (
    userId: string,
    checkId: number,
    hour: Hour,
    minute: Minute
) => {
    const timeString = hour + ':' + minute
    const res = await db
    .update(checks)
    .set({ time: timeString })
    .where(
        and(eq(checks.id, checkId), eq(checks.guardedUserId, userId)),
    )
    return res[0].affectedRows > 0
}

export const toCheck = (check: CheckDB): Check => {
    const time = toHourMinute(check.time)
    return new Check(<Hour>time.hour, <Minute>time.minute, check.id)
}
export const toChecksController = (checks: CheckDB[]): ChecksController => {
    const results: Check[] = []
    for (const check of checks) {
        results.push(toCheck(check))
    }
    return new ChecksController(results)
}

/**
 * Converts a mysql time string to an object with time and minute
 * @param time mysql time string
 */
export const toHourMinute = (time: string) => {
    const a = time.split(':')
    const hour = Number(a[0])
    if (hour >= 24 || hour < 0) {
        throw new Error("Invalid arguments", {
            cause: 'Time field holds an hour value < 0 or >= 24',
        })
    }
    return {
        hour: hour,
        minute: Number(a[1]),
    }
}
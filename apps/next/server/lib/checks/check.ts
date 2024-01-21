import Check from '../types/check'
import { checks } from 'db/schema/checks'
import { db } from 'db'
import { and, eq, or } from 'drizzle-orm'
import {
    createCheckEvent,
    deleteEvent,
    updateEventTiming,
} from '../services/cronicleClient'
import { users } from 'db/schema/auth'
import { CheckState } from 'app/lib/types/checks'
import {
    getTimeForBackup,
    getTimeForReminder,
    updateEventForBackup,
    updateEventForReminder,
} from './checkSettings'
import { localMoment, Time } from 'app/lib/time'
import { sendReminder } from '../services/sendEmail'
import { getUser } from '../user'
import { warn } from '../guard'
import { GuardType } from '../types/gaurd'
import moment from 'moment'

type CheckDB = typeof checks.$inferSelect

export async function addCheck(
    userId: string,
    hour: number,
    minute: number,
): Promise<string | undefined> {
    const timeString = hour + ':' + minute
    const eventId = await createCheckEvent(hour, minute, userId)
    if (eventId) {
        await db.insert(checks).values({
            guardedUserId: userId,
            time: timeString,
            checkId: eventId,
        })

        // required as the nextRequiredCheckDate value in the db must be updated
        await checkOkay(userId, true)

        const checkSettings = await getCheckSettings(userId)
        const check = {
            checkId: eventId,
            hour: hour,
            minute: minute,
            userId: userId,
        }
        await updateEventForReminder(
            check,
            checkSettings!.reminderBeforeCheck.hour,
            checkSettings!.reminderBeforeCheck.minute,
        )
        await updateEventForBackup(
            check,
            checkSettings!.notifyBackupAfter.hour,
            checkSettings!.notifyBackupAfter.minute,
        )
        return eventId
    }
    return undefined
}

export async function removeCheck(checkId: string, userId: string) {
    const checkRes = await db.query.checks.findFirst({
        where: eq(checks.checkId, checkId),
    })

    if (!checkRes) return false

    const check = toCheck(checkRes)

    if (check.notifyId) {
        if (!(await deleteEvent(check.notifyId))) return false
    }
    if (check.backupId) {
        if (!(await deleteEvent(check.backupId))) return false
    }

    const res = await db
        .delete(checks)
        .where(
            and(eq(checks.checkId, checkId), eq(checks.guardedUserId, userId)),
        )

    // required as the nextRequiredCheckDate value in the db must be updated
    await checkOkay(userId, true)

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
        // required as the nextRequiredCheckDate value in the db must be updated
        await checkOkay(userId, true)

        if (!(await updateEventTiming(checkId, hour, minute))) return false

        const checkSettings = await getCheckSettings(userId)
        const check = await db.query.checks.findFirst({
            where: eq(checks.checkId, checkId),
        })

        if (!check) return false

        await updateEventForReminder(
            toCheck(check),
            checkSettings!.reminderBeforeCheck.hour,
            checkSettings!.reminderBeforeCheck.minute,
        )
        await updateEventForBackup(
            toCheck(check),
            checkSettings!.notifyBackupAfter.hour,
            checkSettings!.notifyBackupAfter.minute,
        )
    } else {
        return false
    }
}

export async function getChecks(userId: string, sort?: boolean) {
    const result = await db.query.checks.findMany({
        where: eq(checks.guardedUserId, userId),
    })
    const checksRes = toChecks(result)

    if (!sort) {
        return checksRes
    }

    checksRes.sort(function (a, b) {
        if (a.hour < b.hour) {
            return -1
        } else if (a.hour == b.hour) {
            return a.minute - b.minute
        } else {
            return 1
        }
    })

    return checksRes
}

export async function getCheckSettings(user: string) {
    const res = await db.query.users.findFirst({
        where: eq(users.id, user),
    })
    if (!res) {
        return undefined
    }
    return {
        reminderBeforeCheck: toHourMinute(res.reminderBeforeCheck),
        notifyBackupAfter: toHourMinute(res.notifyBackupAfter),
    }
}

export async function getLastCheckOkay(user: string) {
    const res = await db.query.users.findFirst({
        where: eq(users.id, user),
    })
    if (!res) {
        return undefined
    }
    return convertLastCheckOkay(res.lastManualCheck, res.lastStepCheck)
}

export function convertLastCheckOkay(
    lastManualCheck: Date | null | undefined,
    lastStepCheck: Date | null | undefined,
) {
    let latest = lastManualCheck
    let step = false
    if (lastStepCheck) {
        if (!latest) {
            latest = lastStepCheck
            step = true
        } else if (lastStepCheck > lastManualCheck!) {
            latest = lastStepCheck
            step = true
        }
    }
    return {
        latestCheck: latest ?? undefined,
        step: step,
    }
}

/**
 * returns the new state if a state changes
 * returns undefined if state keeps same
 * @param user
 */
export async function getState(
    userId: string,
    notifyBackupGuards?: Time,
    reminderBeforeCheck?: Time,
): Promise<CheckState | undefined> {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    })
    const previousState = user!.state

    let checkState: CheckState = CheckState.OK

    const lastCheckDate = await getPreviousCheckDate(userId)
    if (!lastCheckDate) {
        return undefined
    }

    const prevCheckDate = await getPreviousCheckDate(userId, lastCheckDate)
    const lastCheckOkay = await getLastCheckOkay(userId)

    if (!lastCheckOkay || !lastCheckOkay.latestCheck || !prevCheckDate) {
        return undefined
    }

    if (!notifyBackupGuards || !reminderBeforeCheck) {
        const checkSettings = await getCheckSettings(userId)
        if (!checkSettings) {
            return undefined
        }
        notifyBackupGuards = checkSettings!.notifyBackupAfter
        reminderBeforeCheck = checkSettings!.notifyBackupAfter
    }

    if (lastCheckOkay!.latestCheck! < prevCheckDate) {
        if (previousState != CheckState.BACKUP) {
            checkState = CheckState.WARNED
            const notifyBackupTime = getTimeForBackup(
                notifyBackupGuards,
                undefined,
                lastCheckDate,
            )
            if (notifyBackupTime.date! <= new Date()) {
                checkState = CheckState.BACKUP
            }
        }
    } else {
        const nextCheckDate = await getNextCheckDate(userId)
        const reminderTime = getTimeForReminder(
            reminderBeforeCheck,
            undefined,
            nextCheckDate,
        )
        if (reminderTime.date! <= new Date()) {
            checkState = CheckState.NOTIFIED
        }
    }

    await db
        .update(users)
        .set({ state: checkState })
        .where(eq(users.id, userId))

    return checkState != previousState ? checkState : undefined
}

/**
 * Updates the state in the db if newState is provided,
 * else it checks for new state with getState and updates in the db
 *
 * returns the new state or undefined
 * @param newState
 */
export async function updateState(
    userId: string,
    newState?: CheckState,
    notifyBackupGuards?: Time,
    reminderBeforeCheck?: Time,
) {
    let state = newState
    if (!newState) {
        newState = await getState(
            userId,
            notifyBackupGuards,
            reminderBeforeCheck,
        )
    }
    await db.update(users).set({ state: newState }).where(eq(users.id, userId))
    return newState
}

/**
 *
 * @param startDate returns the UTC date of the next check according to this date. if undefined, the next check according to current time will be returned.
 * @param user
 * returns:
 * UTC date of the next upcoming check-in time
 * undefined - if no checks are set or an error occurred
 */
async function getNextCheckDate(user: string, startDate?: Date) {
    const checks = await getChecks(user, true)
    if (!checks || checks.length <= 0) {
        return undefined
    }

    let currDate = startDate ?? new Date()

    let nextCheck = checks[0]
    let nextDay = true
    for (const check of checks) {
        if (check.hour > currDate.getUTCHours()) {
            nextCheck = check
            nextDay = false
            break
        } else if (
            check.hour == currDate.getUTCHours() &&
            check.minute > currDate.getUTCMinutes()
        ) {
            nextCheck = check
            nextDay = false
            break
        }
    }

    let nextCheckDate = currDate
    nextCheckDate.setUTCHours(nextCheck.hour)
    nextCheckDate.setUTCMinutes(nextCheck.minute)
    nextCheckDate.setUTCMilliseconds(0)
    nextCheckDate.setUTCSeconds(0)
    if (nextDay) {
        nextCheckDate = new Date(nextCheckDate.getTime() + 86400000)
    }

    return nextCheckDate
}

/**
 *
 * @param user
 * returns:
 * UTC date of the check-in time previous to date (current time if date is omitted)
 * undefined - if no checks are set or an error occurred
 */
async function getPreviousCheckDate(user: string, date?: Date) {
    const checks = await getChecks(user, true)
    checks.reverse()

    if (!checks || checks.length <= 0) {
        return undefined
    }

    let currDate = date ?? new Date()

    let previousCheck = checks[0]
    let previousDay = true
    for (const check of checks) {
        if (check.hour < currDate.getUTCHours()) {
            previousCheck = check
            previousDay = false
            break
        } else if (
            check.hour == currDate.getUTCHours() &&
            check.minute < currDate.getUTCMinutes()
        ) {
            previousCheck = check
            previousDay = false
            break
        }
        // if it is compared to current date
        else if (
            check.hour == currDate.getUTCHours() &&
            check.minute == currDate.getUTCMinutes() &&
            !date
        ) {
            previousCheck = check
            previousDay = false
            break
        }
    }

    let previousCheckDate = currDate
    previousCheckDate.setUTCHours(previousCheck.hour)
    previousCheckDate.setUTCMinutes(previousCheck.minute)
    previousCheckDate.setUTCMilliseconds(0)
    previousCheckDate.setUTCSeconds(0)
    if (previousDay) {
        previousCheckDate = new Date(previousCheckDate.getTime() - 86400000)
    }

    return previousCheckDate
}

export async function checkOkay(user: string, step: boolean) {
    const thisCheckDate = await getNextCheckDate(user)
    const nextRequiredCheckDate = await getNextCheckDate(user, thisCheckDate)
    if (step) {
        const res = await db
            .update(users)
            .set({
                lastStepCheck: new Date(),
                state: CheckState.OK,
                nextRequiredCheckDate: nextRequiredCheckDate ?? null,
            })
            .where(and(eq(users.id, user)))
        return res[0].affectedRows > 0
    } else {
        const res = await db
            .update(users)
            .set({
                lastManualCheck: new Date(),
                state: CheckState.OK,
                nextRequiredCheckDate: nextRequiredCheckDate,
            })
            .where(and(eq(users.id, user)))
        return res[0].affectedRows > 0
    }
}

export async function handleEvent(userId: string) {
    const state = await getState(userId)
    if (!state) {
        return true
    }
    const guardedUser = await getUser(userId, false, true)
    if (!guardedUser) {
        return false
    }
    if (!guardedUser.guards || guardedUser.guards.length <= 0) {
        // do nothing as guarded user has not setup the app correctly
        return true
    }
    if (state == CheckState.NOTIFIED) {
        await sendReminder(
            guardedUser.email,
            guardedUser.name ?? guardedUser.email,
            moment((await getNextCheckDate(guardedUser.id))!).fromNow(),
        )
    } else if (state == CheckState.WARNED) {
        const notifyBackupAfter = (await getCheckSettings(guardedUser.id))
            ?.notifyBackupAfter
        for (const guard of guardedUser.guards!) {
            if (
                guard.priority == GuardType.IMPORTANT ||
                (notifyBackupAfter?.minute == 0 && notifyBackupAfter?.hour == 0)
            ) {
                await warn(
                    guard,
                    guardedUser,
                    (await getLastCheckOkay(guardedUser.id))?.latestCheck!,
                )
            }
        }
    } else if (state == CheckState.BACKUP) {
        for (const guard of guardedUser.guards!) {
            if (guard.priority == GuardType.BACKUP) {
                await warn(
                    guard,
                    guardedUser,
                    (await getLastCheckOkay(guardedUser!.id))?.latestCheck!,
                )
            }
        }
    }
    await updateState(guardedUser.id, state)
    return true
}

/**
 * Converts a DB object to corresponding lib type
 * @param check
 */
export function toCheck(check: CheckDB): Check {
    const time = toHourMinute(check.time)
    return {
        hour: time.hour,
        minute: time.minute,
        checkId: check.checkId,
        userId: check.guardedUserId,
        backupId: check.backupId ?? undefined,
        notifyId: check.notifyId ?? undefined,
    }
}

export function toChecks(checks: CheckDB[]): Check[] {
    const results: Check[] = []
    for (const check of checks) {
        results.push(toCheck(check))
    }
    return results
}

/**
 * Converts a mysql time string to an object with time and minute
 * @param time mysql time string
 */
export function toHourMinute(time: string) {
    const a = time.split(':')
    const hour = Number(a[0])
    if (hour >= 24 || hour < 0) {
        throw new Error(errors.INVALID_ARGUMENTS, {
            cause: 'Time field holds an hour value < 0 or >= 24',
        })
    }
    return {
        hour: hour,
        minute: Number(a[1]),
    }
}

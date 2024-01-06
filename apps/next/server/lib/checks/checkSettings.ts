import { getChecks } from './check'
import {
    createBackupEvent,
    createNotificationEvent,
    deleteEvent,
    updateEventTiming,
} from '../services/cronicleClient'
import { db } from 'db'
import { checks } from 'db/schema/checks'
import { eq, and } from 'drizzle-orm'
import { users } from 'db/schema/auth'
import Check from '../types/check'
import { Time } from 'app/lib/time'

export async function setNotifyBackupAfter(
    hour: number,
    minute: number,
    userId: string,
) {
    const timeString = hour + ':' + minute
    const res = await db
        .update(users)
        .set({ notifyBackupAfter: timeString })
        .where(and(eq(users.id, userId)))
    if (res[0].affectedRows <= 0) return false

    await updateEventsForBackup(hour, minute, userId)

    return true
}

export async function setReminderBeforeCheck(
    hour: number,
    minute: number,
    userId: string,
) {
    const timeString = hour + ':' + minute
    const res = await db
        .update(users)
        .set({ reminderBeforeCheck: timeString })
        .where(and(eq(users.id, userId)))
    if (res[0].affectedRows <= 0) return false

    await updateEventsForReminder(hour, minute, userId)

    return true
}

export async function updateEventForReminder(
    check: Check,
    hour: number,
    minute: number,
) {
    if (hour == 0 && minute == 0) {
        if (check.notifyId) {
            await deleteEvent(check.notifyId)
            await db
                .update(checks)
                .set({ notifyId: null })
                .where(eq(checks.checkId, check.checkId))
        }
    } else {
        const reminderTime = getTimeForReminder(
            { hour, minute },
            {
                hour: check.hour,
                minute: check.minute,
            },
        )
        if (check.notifyId) {
            await updateEventTiming(
                check.notifyId,
                reminderTime.hour,
                reminderTime.minute,
            )
        } else {
            const notifyId = await createNotificationEvent(
                reminderTime.hour,
                reminderTime.minute,
                check.userId,
            )
            if (notifyId) {
                await db
                    .update(checks)
                    .set({ notifyId: notifyId })
                    .where(eq(checks.checkId, check.checkId))
            }
        }
    }
}

export async function updateEventsForReminder(
    hour: number,
    minute: number,
    user: string,
) {
    const checksRes = await getChecks(user)
    for (const check of checksRes) {
        await updateEventForReminder(check, hour, minute)
    }
}

export async function updateEventForBackup(
    check: Check,
    hour: number,
    minute: number,
) {
    if (hour == 0 && minute == 0) {
        if (check.backupId) {
            await deleteEvent(check.backupId)
            await db
                .update(checks)
                .set({ backupId: null })
                .where(eq(checks.checkId, check.checkId))
        }
    } else {
        const backupTime = getTimeForBackup(
            { hour, minute },
            {
                hour: check.hour,
                minute: check.minute,
            },
        )
        if (check.backupId) {
            await updateEventTiming(
                check.backupId,
                backupTime.hour,
                backupTime.minute,
            )
        } else {
            const backupId = await createBackupEvent(
                backupTime.hour,
                backupTime.minute,
                check.userId,
            )
            if (backupId) {
                await db
                    .update(checks)
                    .set({ backupId: backupId })
                    .where(eq(checks.checkId, check.checkId))
            }
        }
    }
}

export async function updateEventsForBackup(
    hour: number,
    minute: number,
    user: string,
) {
    const checksRes = await getChecks(user)
    for (const check of checksRes) {
        await updateEventForBackup(check, hour, minute)
    }
}

export function getTimeForReminder(
    remindBefore: Time,
    checkTime?: Time,
    checkDate?: Date,
): Time {
    let date = checkDate
    if (!date) {
        date = new Date()
        date.setUTCHours(checkTime!.hour)
        date.setUTCMinutes(checkTime!.minute)
    }

    date.setUTCMinutes(date.getUTCMinutes() - remindBefore.minute)
    date.setUTCHours(date.getUTCHours() - remindBefore.hour)

    return {
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        date: date,
    }
}

export function getTimeForBackup(
    notifyAfter: Time,
    checkTime?: Time,
    checkDate?: Date,
): Time {
    let date = checkDate
    if (!date) {
        date = new Date()
        date.setUTCHours(checkTime!.hour)
        date.setUTCMinutes(checkTime!.minute)
    }

    date.setUTCMinutes(date.getUTCMinutes() + notifyAfter.minute)
    date.setUTCHours(date.getUTCHours() + notifyAfter.hour)

    return {
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        date: date,
    }
}

import {db} from "db";
import {and, eq} from "drizzle-orm";
import {users} from "db/schema/auth";
import {toChecksController, toHourMinute} from "../adapters/db/checks";
import {addCheck as addCheckToDB, modifyCheck as modifyCheckInDB, removeCheck as removeCheckFromDB} from "../adapters/db/checks"
import {
    deleteCheck as deleteCheckFromQueue,
    addCheck as addCheckToQueue,
    updateCheck as updateCheckInQueue, updateBackupTime, updateReminderTime
} from "../adapters/scheduler/checks";
import {
    getLastCheckIn,
    toExternalUserImage,
    toSeconds,
    updateCheckState,
    updateNextRequiredCheckIn
} from '../adapters/db/users'
import {Hour, Minute} from "app/lib/types/time";
import {ChecksController} from "../entities/checks/ChecksController";
import { CheckState } from 'app/lib/types/check'
import { deleteRepeatingNotifier } from '../adapters/scheduler/repeatingNotifiers'
import { CheckStateController } from '../entities/checks/CheckStateController'
import { CheckInNotification, WarningNotification } from './notifications/ConcreteNotifications'
import { StandardNotifier, WarningNotifier } from './notifications/ConcreteNotifiers'
import { GuardType } from 'app/lib/types/guardUser'
import { UserDeleted } from './checkState'
import { NotificationSubmitter } from '../entities/notifications/NotificationSubmitter'
import { Recipient } from '../entities/notifications/Notifications'
import { getAllSubmitters, getPushSubmitters } from './notifications/NotificationSubmitters'
import { checks } from 'db/schema/checks'

/**
 *
 * @param userId
 * @param step
 * @param external external checkins are only successfull if user state is WARNED or BACKUP
 */
export const checkIn = async (userId: string, step: boolean, external = false, date = new Date(), initiatorId = userId) => {
    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            checks: true,
            currentCheck: true,
            notificationChannels: true,
            guards: {
                with: {
                    guardUser: {
                        with: {
                            notificationChannels: true
                        }
                    }
                }
            }
        }
    })

    if(!data) {
        throw new Error("User not found. Check was not added.")
    }

    if(external && data.state != CheckState.WARNED && data.state != CheckState.BACKUP) {
        throw new Error("User can not be checked in as it is not in WARNED or BACKUP state.")
    }

    if(data.nextCheckInPossibleFrom && (new Date(date)).getTime() <= (new Date(data.nextCheckInPossibleFrom)).getTime()) {
        throw new Error("User can not be checked in as check in with this date is not possible.")
    }

    const checksController = toChecksController(data.checks)

    let res = undefined;
    if(step) {
        res = await db.update(users).set({state: CheckState.OK, lastStepCheck: date}).where(eq(users.id, userId))
    }
    else {
        res = await db.update(users).set({ state: CheckState.OK, lastManualCheck: date}).where(eq(users.id, userId))
    }

    if(res[0].affectedRows <= 0) {
        throw new Error("Failed updating nextRequiredCheckDate in DB")
    }

    await reschedule(userId, checksController, data.currentCheckId, date, data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), true)

    // notify all guards that checkIn happend by push notification
    if(data.state == CheckState.WARNED || data.state == CheckState.BACKUP ) {
        const notification = new CheckInNotification(data.id, data.name ?? data.email, data.image ? toExternalUserImage(data.image) : null, initiatorId)
        const submitters: NotificationSubmitter[] = []

        for (const guard of data.guards) {
            const recipient: Recipient = {
                name: guard.guardUser.name ?? guard.guardUser.email
            }
            submitters.push(...await getPushSubmitters(recipient, undefined, guard.guardUser.notificationChannels))
        }

        const notifier = new StandardNotifier(notification, submitters)
        await notifier.submit()
    }

    if(data.state == CheckState.WARNED || data.state == CheckState.BACKUP) {
        await deleteRepeatingNotifier(userId)
    }
}

export const addCheck = async (userId: string, hour: Hour, minute: Minute ): Promise<boolean> => {
    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            checks: true,
            currentCheck: true
        }
    })

    if(!data) {
        throw new Error("User not found. Check was not added.")
    }

    for (const check of data.checks) {
        const hourMinute = toHourMinute(check.time)
        const checkTime = 60 * hourMinute.hour + hourMinute.minute;
        const time = 60 * hour + minute;
        const diff = Math.abs(checkTime - time);

        if(diff < 30) {
            throw new Error("Check not added as there must be a minimum of 30 minutes between checks")
        }
    }

    if(!await addCheckToDB(userId, hour, minute)) {
        return false
    }

    const dataAfterAdd = await db.query.checks.findMany({
        where: eq(checks.guardedUserId, userId)
    })

    if(!dataAfterAdd) {
        throw new Error("User not found. Check was not added.")
    }

    const checksController = toChecksController(dataAfterAdd)

    return await reschedule(userId, checksController, data.currentCheckId, getLastCheckIn(data.lastManualCheck, data.lastStepCheck), data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), false)
}

/*
export const modifyCheck = async (userId: string, checkId: number, hour: Hour, minute: Minute): Promise<boolean> => {
    if(!await modifyCheckInDB(userId, checkId, hour, minute)) {
        return false
    }

    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            checks: true,
            currentCheck: true
        }
    })

    if(!data) {
        throw new Error("User not found. Check was not modified.")
    }

    const checksController = toChecksController(data.checks)
    return await reschedule(userId, checksController, data.currentCheckId, getLastCheckIn(data.lastManualCheck, data.lastStepCheck), data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), false)
}

 */

export const removeCheck = async (userId: string, checkId: number): Promise<boolean> => {
    if(!await removeCheckFromDB(userId, checkId)) {
        return false
    }

    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            checks: true,
            currentCheck: true
        }
    })

    if(!data) {
        throw new Error("User not found. Check was not modified.")
    }

    const checksController = toChecksController(data.checks)
    return await reschedule(userId, checksController, data.currentCheckId, getLastCheckIn(data.lastManualCheck, data.lastStepCheck), data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), false)
}

export const changeReminderTime = async (userId: string, hour: Hour, minute: Minute): Promise<boolean> => {
    const timeString = hour + ':' + minute
    const res = await db
    .update(users)
    .set({ reminderBeforeCheck: timeString })
    .where(and(eq(users.id, userId)))

    if(res[0].affectedRows <= 0) {
        return false
    }

    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            checks: true
        }
    })

    if(!data) {
        throw new Error("User not found. Check was not modified.")
    }

    if(data.currentCheckId) {
        const checksController = toChecksController(data.checks)
        const checkInPossibleFrom = checksController.getNextCheck(getLastCheckIn(data.lastManualCheck, data.lastStepCheck))?.date
        await updateReminderTime(data.currentCheckId, toSeconds(timeString), checkInPossibleFrom)
    }

    return true
}

export const changeBackupTime = async (userId: string, hour: Hour, minute: Minute): Promise<boolean> => {
    const timeString = hour + ':' + minute
    const res = await db
    .update(users)
    .set({ notifyBackupAfter: timeString })
    .where(and(eq(users.id, userId)))

    if(res[0].affectedRows <= 0) {
        return false
    }

    const data = await db.query.users.findFirst({
        where: eq(users.id, userId)
    })

    if(!data) {
        throw new Error("User not found. Check was not modified.")
    }

    if(data.currentCheckId) {
        await updateBackupTime(data.currentCheckId, toSeconds(timeString))
    }

    return true
}

export const getCheckSettings = async (userId: string) => {
    const res = await db.query.users.findFirst({
        where: eq(users.id, userId),
    })
    if (!res) {
        return undefined
    }
    return {
        reminderBeforeCheck: toHourMinute(res.reminderBeforeCheck),
        notifyBackupAfter: toHourMinute(res.notifyBackupAfter),
    }
}



/**
 * Applies changes in checksController to the BullMQ Checks Queue and to the nextRequiredCheckDate field in the users db table
 *
 * @param checksController
 * @param currentCheckId aktueller Check in der Queue
 * @param lastCheckIn letzter Check In
 * @param nextRequiredCheckIn check in zeit des in der queue befindlichen checks
 * @param reminder
 * @param backup
 * @param forceNewJob force the creation of a new job in checkQueue even if a respective job with the same check id exist.
 * Used for checkIn to ensure that the check state gets reset if only one check is present.
 */
const reschedule = async (userId: string, checksController: ChecksController, currentCheckId: number | null, lastCheckIn: Date | undefined, nextRequiredCheckIn: Date | null, reminder: number, backup: number, forceNewJob = false): Promise<boolean> => {
    const nextRequired = checksController.getNextRequiredCheck(lastCheckIn)
    const checkInPossibleFrom = checksController.getNextCheck(lastCheckIn)?.date

    if(nextRequired) {
        if(nextRequired.check.id != currentCheckId || forceNewJob) {
            if(currentCheckId) {
                await deleteCheckFromQueue(currentCheckId)
            }
            if(!await updateNextRequiredCheckIn(userId, nextRequired.date, nextRequired.check.id, checkInPossibleFrom ?? null)) {
                throw new Error("Error while updating the next required check in date")
            }
            return await addCheckToQueue(userId, nextRequired.check.id, nextRequired.date, checkInPossibleFrom, reminder, backup)
        }
        else if ((new Date(nextRequired.date)).getTime() != nextRequiredCheckIn?.getTime()) {
            if(!await updateNextRequiredCheckIn(userId, nextRequired.date, nextRequired.check.id, checkInPossibleFrom ?? null)) {
                throw new Error("Error while updating the next required check in date")
            }

            if(!await updateCheckInQueue(nextRequired.check.id, nextRequired.date, checkInPossibleFrom, reminder, backup)) {
                return await addCheckToQueue(userId, nextRequired.check.id, nextRequired.date, checkInPossibleFrom, reminder, backup)
            }
            return true
        }
    }


    else if(currentCheckId) {
        await deleteCheckFromQueue(currentCheckId)
        if(!await updateNextRequiredCheckIn(userId, null, null, null)) {
            throw new Error("Error while updating the next required check in date")
        }
        return true
    }
    return true
}
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { users } from 'db/schema/auth'
import { CheckStateController } from '../entities/checks/CheckStateController'
import { getLastCheckIn, toExternalUserImage, toSeconds, updateCheckState } from '../adapters/db/users'
import { Recipient } from '../entities/notifications/Notifications'
import { CheckState } from 'app/lib/types/check'
import { ReminderNotification, WarningNotification } from './notifications/ConcreteNotifications'
import { StandardNotifier, WarningNotifier } from './notifications/ConcreteNotifiers'
import { getMainSubmitters, getPushSubmitters } from './notifications/NotificationSubmitters'
import { GuardType } from 'app/lib/types/guardUser'

export class UserDeleted extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

/**
 * Triggered by check queue
 * checks whether a reminder is necessary and performs the reminder
 * @param userId
 */
export const remind = async (userId: string, criticalReminder: boolean) => {
    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            notificationChannels: true
        }
    })

    if(!data) {
        throw new UserDeleted("User not found. User is not reminded.")
    }

    if(!data.nextRequiredCheckDate) {
        return
    }

    const stateController = new CheckStateController(data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), data.state)

    if(stateController.needsReminder()) {
        const recipient: Recipient = {
            name: data.name ?? ""
        }
        const notification = new ReminderNotification(data.id, data.nextRequiredCheckDate, criticalReminder)

        let submitters = undefined
        if(criticalReminder) {
            submitters = await getMainSubmitters(recipient, undefined, data.email, data.notificationChannels, !data.notificationsByEmail)
        }
        else {
            submitters = await getPushSubmitters(recipient, undefined, data.notificationChannels)
        }

        const notifier = new StandardNotifier(notification, submitters)

        await notifier.submit()
        await updateCheckState(userId, CheckState.NOTIFIED)
    }
}

/**
 * Triggered by check queue
 * checks whether a warning is necessary and performs the warning
 * @param userId
 */
export const warn = async (userId: string, backup: boolean) => {
    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            guards: {
                with: {
                    guardedUser: {
                        with: {
                            notificationChannels: true
                        }
                    }
                }
            }
        }
    })

    if(!data) {
        throw new UserDeleted("User not found. Check was not added.")
    }

    if(!data.nextRequiredCheckDate) {
        return
    }


    const stateController = new CheckStateController(data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), data.state)

    if((!backup && stateController.needsWarning()) || (backup && stateController.needsBackupWarning())) {
        const notification = new WarningNotification(data.name ?? data.email, userId, data.image ? toExternalUserImage(data.image) : null, getLastCheckIn(data.lastManualCheck, data.lastStepCheck)!, data.currentCheckId!, data.nextRequiredCheckDate)
        const notifier = new WarningNotifier(userId, backup ? GuardType.BACKUP : GuardType.IMPORTANT, data.nextRequiredCheckDate, notification)
        await notifier.submit()
        await updateCheckState(userId, CheckState.WARNED)
    }



}
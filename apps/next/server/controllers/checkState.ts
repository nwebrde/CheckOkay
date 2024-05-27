import { db } from 'db'
import { eq } from 'drizzle-orm'
import { users } from 'db/schema/auth'
import { CheckStateController } from '../entities/checks/CheckStateController'
import { toSeconds, updateCheckState } from '../adapters/db/users'
import { Recipient } from '../entities/notifications/Notifications'
import { CheckState } from 'app/lib/types/check'
import { ReminderNotification, WarningNotification } from './notifications/ConcreteNotifications'
import { StandardNotifier, WarningNotifier } from './notifications/ConcreteNotifiers'
import { getMainSubmitters } from './notifications/NotificationSubmitters'
import { GuardType } from 'app/lib/types/guardUser'

export const remind = async (userId: string) => {
    const data = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            notificationChannels: true
        }
    })

    if(!data) {
        throw new Error("User not found. Check was not added.")
    }

    if(!data.nextRequiredCheckDate) {
        return
    }

    const stateController = new CheckStateController(data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), data.state)

    if(stateController.needsReminder()) {
        const recipient: Recipient = {
            name: data.name ?? ""
        }
        const notification = new ReminderNotification(data.id, data.nextRequiredCheckDate)
        const notifier = new StandardNotifier(notification, await getMainSubmitters(recipient, undefined, data.email, data.notificationChannels))
        await notifier.submit()
        await updateCheckState(userId, CheckState.NOTIFIED)
    }
}

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
        throw new Error("User not found. Check was not added.")
    }

    if(!data.nextRequiredCheckDate) {
        return
    }

    const stateController = new CheckStateController(data.nextRequiredCheckDate, toSeconds(data.reminderBeforeCheck), toSeconds(data.notifyBackupAfter), data.state)

    if((!backup && stateController.needsWarning()) || (backup && stateController.needsBackupWarning())) {
        const notification = new WarningNotification(data.name ?? "", userId, data.nextRequiredCheckDate)
        const notifier = new WarningNotifier(userId, backup ? GuardType.BACKUP : GuardType.IMPORTANT, notification)
        await notifier.submit()
        await updateCheckState(userId, CheckState.WARNED)
    }
}
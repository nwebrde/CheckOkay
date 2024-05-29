import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/de'
import {Notification} from "../../entities/notifications/Notifications";
import {db} from "db";
import {eq} from "drizzle-orm";
import {users} from "db/schema/auth";
import { getLastCheckIn } from '../../adapters/db/users'

export const enum ConcreteNotificationType {
    REMINDER_NOTIFICATION = "REMINDER_NOTIFICATION",
    WARNING_NOTIFICATION = "WARNING_NOTIFICATION",
    NEW_GUARD_NOTIFICATION = "NEW_GUARD_NOTIFICATION",
}

// All attributes of concrete notifications must be of primitive types (no class instances!) as they are serialized into json or need proper handling in toConcreteNotification()

export class ReminderNotification extends Notification {
    nextRequiredCheckIn: Date
    userId: string

    constructor(userId: string, nextRequiredCheckIn: Date) {
        dayjs.locale('de')
        dayjs.extend(relativeTime)

        super(ConcreteNotificationType.REMINDER_NOTIFICATION, "Ist alles okay?", `denke bitte daran die Frage in spätestens ${dayjs(nextRequiredCheckIn).toNow(true)} zu beantworten.`)
        this.nextRequiredCheckIn = nextRequiredCheckIn
        this.userId = userId
    }
    async refresh() {
        const data = await db.query.users.findFirst({
            where: eq(users.id, this.userId),
            with: {
                notificationChannels: true
            }
        })

        if(!data) {
            return false
        }

        if(!data.nextRequiredCheckDate || data.nextRequiredCheckDate > new Date()) {
            return false
        }

        this.nextRequiredCheckIn = data.nextRequiredCheckDate

        dayjs.locale('de')
        dayjs.extend(relativeTime)

        this.text = `denke bitte daran die Frage in spätestens ${dayjs(this.nextRequiredCheckIn).toNow(true)} zu beantworten.`

        return true
    }
}

export class WarningNotification extends Notification {
    guardedUserId: string
    guardedPersonName: string
    lastCheckIn: Date

    constructor(guardedPersonName: string, guardedUserId: string, lastCheckIn: Date) {
        dayjs.locale('de')
        dayjs.extend(relativeTime)

        super(ConcreteNotificationType.WARNING_NOTIFICATION, `${guardedPersonName} reagiert nicht mehr`, `Es scheint ein Problem bei ${guardedPersonName} zu geben. ${guardedPersonName} hat nicht auf eine Statusabfrage reagiert.<br/><br/>\nDie letzte Reaktion fand vor ${dayjs(lastCheckIn).fromNow(true)} statt. `)
        this.guardedUserId = guardedUserId
        this.guardedPersonName = guardedPersonName
        this.lastCheckIn = lastCheckIn
    }

    async refresh() {
        const data = await db.query.users.findFirst({
            where: eq(users.id, this.guardedUserId),
            with: {
                notificationChannels: true
            }
        })

        if(!data) {
            return false
        }

        // check if still needs warning
        if(!data.nextRequiredCheckDate || data.nextRequiredCheckDate > new Date()) {
            return false
        }

        if(!data.lastStepCheck && !data.lastManualCheck) {
            return false
        }

        this.lastCheckIn = getLastCheckIn(data.lastManualCheck, data.lastStepCheck)!

        dayjs.locale('de')
        dayjs.extend(relativeTime)

        this.text = `Es scheint ein Problem bei ${this.guardedPersonName} zu geben. ${this.guardedPersonName} hat nicht auf eine Statusabfrage reagiert.<br/><br/>\nDie letzte Reaktion fand vor ${dayjs(this.lastCheckIn).fromNow(true)} statt. `

        return true
    }
}

export class NewGuardNotification extends Notification {
    constructor(guardName: string) {
        super(ConcreteNotificationType.NEW_GUARD_NOTIFICATION, `${guardName} passt auf dich auf`, `ab sofort passt ${guardName} mit auf dich auf. \n
        War das ein Fehler? Du kannst deinen Guard jederzeit wieder entfernen.`);
    }

    async refresh() {
        return false
    }
}

export const toConcreteNotification = (plainObject: any): Notification => {
    let result: Notification
    switch (plainObject.notificationType) {
        case ConcreteNotificationType.REMINDER_NOTIFICATION:
            result = new ReminderNotification(plainObject.userId, plainObject.nextRequiredCheckIn)
            break;
        case ConcreteNotificationType.WARNING_NOTIFICATION:
            result = new WarningNotification(plainObject.guardedPersonName, plainObject.guardedUserId, plainObject.nextRequiredCheckIn)
            break;
        case ConcreteNotificationType.NEW_GUARD_NOTIFICATION:
            result = new NewGuardNotification(plainObject.guardName)
            break;
        default:
            throw new Error("Concrete notification is not correctly implemented")
    }

    return result
}
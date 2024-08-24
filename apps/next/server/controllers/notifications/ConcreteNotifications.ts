import {Notification} from "../../entities/notifications/Notifications";
import {db} from "db";
import {eq} from "drizzle-orm";
import {users} from "db/schema/auth";
import { getLastCheckIn, toExternalUserImage } from '../../adapters/db/users'
import dayjs from 'dayjs'


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
        super(ConcreteNotificationType.REMINDER_NOTIFICATION, "Ist alles okay?", `denke bitte daran die Frage in spätestens ${dayjs(nextRequiredCheckIn).toNow(true)} zu beantworten.`, undefined, undefined, "reminder", false, true)
        this.nextRequiredCheckIn = new Date(nextRequiredCheckIn)
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

        this.nextRequiredCheckIn = new Date(data.nextRequiredCheckDate)

        this.text = `denke bitte daran die Frage in spätestens ${dayjs(this.nextRequiredCheckIn).toNow(true)} zu beantworten.`

        return true
    }
}

export class WarningNotification extends Notification {
    guardedUserId: string
    guardedPersonName: string
    lastCheckIn: Date

    relatedRequiredCheckInDate: Date
    relatedCheckId: number // check id that fired this warning

    constructor(guardedPersonName: string, guardedUserId: string, guardedUserImage: string | null, lastCheckIn: Date, relatedCheckId: number, relatedRequiredCheckInDate: Date) {
        super(ConcreteNotificationType.WARNING_NOTIFICATION, `${guardedPersonName} reagiert nicht mehr`, `Es scheint ein Problem bei ${guardedPersonName} zu geben. ${guardedPersonName} hat nicht auf eine Statusabfrage reagiert. \n Die letzte Reaktion fand vor ${dayjs(lastCheckIn).fromNow(true)} statt. `, undefined, `Ich reagiere nicht mehr. Meine letzte Rückmeldung war vor ${dayjs(lastCheckIn).fromNow(true)}. Bitte schaue nach, ob es mir gut geht.`, "warning", false, false, {name: guardedPersonName, image: guardedUserImage})
        this.guardedUserId = guardedUserId
        this.guardedPersonName = guardedPersonName
        this.lastCheckIn = new Date(lastCheckIn)
        this.relatedCheckId = relatedCheckId
        this.relatedRequiredCheckInDate = new Date(relatedRequiredCheckInDate)
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
        if(!data.nextRequiredCheckDate || data.nextRequiredCheckDate.getTime() != this.relatedRequiredCheckInDate.getTime() || data.currentCheckId != this.relatedCheckId || !data.nextRequiredCheckDate || data.nextRequiredCheckDate > new Date()) {
            return false
        }

        if(!data.lastStepCheck && !data.lastManualCheck) {
            return false
        }

        this.sender = {name: data.name ?? data.email, image: data.image ? toExternalUserImage(data.image) : null}
        this.lastCheckIn = new Date(getLastCheckIn(data.lastManualCheck, data.lastStepCheck)!)
        this.text = `Es scheint ein Problem bei ${this.guardedPersonName} zu geben. ${this.guardedPersonName} hat nicht auf eine Statusabfrage reagiert. \n Die letzte Reaktion fand vor ${dayjs(this.lastCheckIn).fromNow(true)} statt. `
        this.pushOnlyText = `Ich reagiere nicht mehr. Meine letzte Rückmeldung war vor ${dayjs(this.lastCheckIn).fromNow(true)}. Bitte schaue nach, ob es mir gut geht.`
        this.isCritical = true

        return true
    }
}

export class NewGuardNotification extends Notification {
    constructor(guardName: string, guardImage: string | null) {
        super(ConcreteNotificationType.NEW_GUARD_NOTIFICATION, `${guardName} passt auf dich auf`, `ab sofort passt ${guardName} mit auf dich auf. \n
        War das ein Fehler? Du kannst deinen Guard jederzeit wieder entfernen.`, undefined, "Ich passe ab sofort auf dich auf.", "newGuard", false, false, {name: guardName, image: guardImage});
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
            result = new WarningNotification(plainObject.guardedPersonName, plainObject.guardedUserId, plainObject.sender.image, plainObject.lastCheckIn, plainObject.relatedCheckId, plainObject.relatedRequiredCheckInDate)
            break;
        case ConcreteNotificationType.NEW_GUARD_NOTIFICATION:
            result = new NewGuardNotification(plainObject.guardName, plainObject.sender.image)
            break;
        default:
            throw new Error("Concrete notification is not correctly implemented")
    }

    return result
}
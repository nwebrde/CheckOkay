import {ConcreteNotificationType} from "../../controllers/notifications/ConcreteNotifications";

export type Recipient = {
    name: string;
}

export abstract class Notification {
    public notificationType: ConcreteNotificationType
    public subject: string
    public text: string

    constructor(notificationType: ConcreteNotificationType, subject: string, text: string) {
        this.notificationType = notificationType
        this.subject = subject
        this.text = text
    }

    /**
     * Checks whether the notification should be scheduled for send or if it is expired
     * Refreshes the text and subject of the Notification with current DB data
     *
     * @returns false if the notification is expired and should not be sent
     */
    abstract refresh(): Promise<boolean>
}
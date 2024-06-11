import {ConcreteNotificationType} from "../../controllers/notifications/ConcreteNotifications";

export type Recipient = {
    name: string;
}

export abstract class Notification {
    public notificationType: ConcreteNotificationType
    public subject: string
    public text: string

    public pushCategoryIdentifier: string | undefined
    public pushOnlyText: string | undefined
    public mailOnlyText: string | undefined

    constructor(notificationType: ConcreteNotificationType, subject: string, text: string, mailOnlyText?: string, pushOnlyText?: string, pushCategoryIdentifier?: string) {
        this.notificationType = notificationType
        this.subject = subject
        this.text = text
        this.mailOnlyText = mailOnlyText
        this.pushOnlyText = pushOnlyText
        this.pushCategoryIdentifier = pushCategoryIdentifier
    }

    /**
     * Checks whether the notification should be scheduled for send or if it is expired
     * Refreshes the text and subject of the Notification with current DB data
     *
     * @returns false if the notification is expired and should not be sent
     */
    abstract refresh(): Promise<boolean>
}
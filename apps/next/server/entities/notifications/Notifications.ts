import {ConcreteNotificationType} from "../../controllers/notifications/ConcreteNotifications";

export type Recipient = {
    name: string;
}

export type Sender = {
    name: string | undefined;
    image: string | null | undefined;
    id: string;
    initiatorId: string | null | undefined;
}

export abstract class Notification {
    public notificationType: ConcreteNotificationType
    public subject: string
    public text: string

    public pushCategoryIdentifier: string | undefined
    public pushOnlyText: string | undefined
    public mailOnlyText: string | undefined

    public isCritical: boolean
    public isSensitive: boolean
    public sender: Sender | undefined
    public isDataOnly: boolean


    constructor(notificationType: ConcreteNotificationType, subject: string, text: string, mailOnlyText?: string, pushOnlyText?: string, pushCategoryIdentifier?: string, isCritical = false, isSensitive = false, isDataOnly = false, sender?: Sender) {
        this.notificationType = notificationType
        this.subject = subject
        this.text = text
        this.mailOnlyText = mailOnlyText
        this.pushOnlyText = pushOnlyText
        this.pushCategoryIdentifier = pushCategoryIdentifier
        this.isCritical = isCritical
        this.isSensitive = isSensitive
        this.isDataOnly = isDataOnly
        this.sender = sender
    }

    /**
     * Checks whether the notification should be scheduled for send or if it is expired
     * Refreshes the text and subject of the Notification with current DB data
     *
     * @returns false if the notification is expired and should not be sent
     */
    abstract refresh(): Promise<boolean>
}
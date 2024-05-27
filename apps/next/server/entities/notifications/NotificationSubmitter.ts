import {Notification, Recipient} from "./Notifications";

export abstract class NotificationSubmitter {
    recipient: Recipient
    protected constructor(recipient: Recipient) {
        this.recipient = recipient
    }

    abstract submit(notification: Notification): Promise<void>
}
import {Notification} from "./Notifications";

export abstract class Notifier {

    notification: Notification

    protected constructor(notification: Notification) {
        this.notification = notification;
    }

    abstract submit(): void
}
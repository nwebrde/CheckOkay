import {Notification} from "./Notifications";

export interface NotificationSubmitter {
    submit(notification: Notification): Promise<void>
}
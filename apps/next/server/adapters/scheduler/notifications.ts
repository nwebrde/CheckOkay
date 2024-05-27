import {emailQueue, pushQueue} from "./config";
import {Notification, Recipient} from "../../entities/notifications/Notifications";


/**
 *
 * @param email
 * @param notification
 * @param delay in seconds
 */
export const addEmail = async (email: string, recipient: Recipient, notification: Notification, delay: number = 0) => {
    await emailQueue.add('email', {
        notification: notification,
        recipient: recipient,
        address: email
    }, { delay: delay * 1000 });
}

/**
 *
 * @param token
 * @param notification
 * @param delay in seconds
 */
export const addPush = async (token: string, recipient: Recipient, notification: Notification, delay: number = 0) => {
    await pushQueue.add('push', {
        notification: notification,
        recipient: recipient,
        address: token
    }, { delay: delay * 1000 });
}
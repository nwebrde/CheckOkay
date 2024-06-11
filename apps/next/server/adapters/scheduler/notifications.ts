import { emailQueue, pushQueue, queue, STANDARD_QUEUE_JOBS } from './config'
import {Notification, Recipient} from "../../entities/notifications/Notifications";
import { Ticket } from '../notificationChannels/push'


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
export const addPush = async (tokens: string[], notification: Notification, delay: number = 0, checkTickets: boolean = true) => {
    await pushQueue.add('push', {
        notification: notification,
        tokens: tokens,
        checkTickets: checkTickets
    }, { delay: delay * 1000 });
}

/**
 *
 * @param token
 * @param notification
 * @param delay in seconds
 */
export const addTickets = async(tickets: Ticket[], notification: Notification, delay: number = 0) => {
    await queue.add(STANDARD_QUEUE_JOBS.PUSH_TICKET, {
        tickets,
        notification,
    }, {
        delay: delay * 1000,
        attempts: 4,
        backoff: {
            type: 'exponential',
            delay: 15 * 60000, // 15 minutes, spans 3,75 hours
        }});
}
import {send as sendMailImplementation} from "../../adapters/notificationChannels/email";
import { checkTickets, send as sendPushImplementation, Ticket } from '../../adapters/notificationChannels/push'

import {Recipient, Notification} from "../../entities/notifications/Notifications";
import { addPush, addTickets } from '../../adapters/scheduler/notifications'
import { removePushTokens } from '../../adapters/db/notificationChannels'

// TODO: Je nach Notification Klasse muss vor dem senden geprüft werden
// TODO: Retry Push
export const sendMail = async (toMail: string, recipient: Recipient, notification: Notification) => {
    await sendMailImplementation(toMail, recipient, notification)
}

export const sendPush = async (pushTokens: string[], notification: Notification) => {
    const { failedTokens, deregisterTokens, tickets } = await sendPushImplementation(pushTokens, notification)

    if(tickets.length > 0) {
        await addTickets(tickets, notification, 15 * 60);
    }

    if(deregisterTokens.length > 0) {
        await removePushTokens(deregisterTokens)
    }

    return failedTokens
}

export const checkPush = async (tickets: Ticket[], notification: Notification) => {
    const { failedTokens, deregisterTokens, failedReceipts } = await checkTickets(tickets)

    if(failedTokens.length > 0) {
        await addPush(failedTokens, notification, 30 * 60, false)
    }

    if(deregisterTokens.length > 0) {
        await removePushTokens(deregisterTokens)
    }

    return failedReceipts
}
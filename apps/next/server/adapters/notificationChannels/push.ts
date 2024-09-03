import { Expo, ExpoPushMessage, ExpoPushReceipt, ExpoPushTicket } from 'expo-server-sdk'
import { Notification, Recipient } from '../../entities/notifications/Notifications'

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({
    //accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true // this can be set to true in order to use the FCM v1 API
});
export type PushResponse = {
    deregisterTokens: string[]
    failedTokens: string[]
}

export type SendPushResponse = PushResponse & {
    tickets: Ticket[]
}

export type ReceiptPushResponse = PushResponse & {
    failedReceipts: Ticket[]
}

export type Ticket = {
    token: string
    ticket: string
}

/**
 * @return recipient id to check for delivery
 * @param pushTokens
 * @param notifications must match the index of pushToken
 */
export const send = async (
    pushTokens: string[],
    notification: Notification
): Promise<SendPushResponse> => {
    for (let pushToken of pushTokens) {
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
    }

    let message = {
        to: pushTokens,
        sound: "default",
        body: notification.pushOnlyText ? notification.pushOnlyText : notification.text,
        title: notification.subject,
        categoryId: notification.pushCategoryIdentifier,
        priority: "high",
        mutableContent: true,
        ttl: 604800, // one week
        data: {
            "categoryId": notification.pushCategoryIdentifier,
            "criticalAlert": notification.isCritical ? "1" : "0",
            "timeSensitive": notification.isSensitive ? "1" : "0",
            "sender": {
                "name": notification.sender?.name ?? "",
                "image": notification.sender?.image ?? "",
                "id": notification.sender?.id ?? ""
            }
        }
    };

    if(notification.isDataOnly) {
        message = {
            to: pushTokens,
            categoryId: notification.pushCategoryIdentifier,
            priority: "high",
            ttl: 604800, // one week
            data: {
                "categoryId": notification.pushCategoryIdentifier,
                "criticalAlert": notification.isCritical ? "1" : "0",
                "timeSensitive": notification.isSensitive ? "1" : "0",
                "sender": {
                    "name": notification.sender?.name ?? "",
                    "image": notification.sender?.image ?? "",
                    "id": notification.sender?.id ?? ""
                }
            },
            // @ts-ignore
            "_contentAvailable": true
        }
    }

// The Expo push notification service accepts batches of notifications so
// that you don't need to send 1000 requests to send 1000 notifications. We
// recommend you batch your notifications to reduce the number of requests
// and to compress them (notifications with similar content will get
// compressed).
    const returnTickets: Ticket[] = [];
    const failedTokens: string[] = [];
    const deregisterTokens: string[] = [];

    try {
        let tickets = await expo.sendPushNotificationsAsync([message]);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors

        for (let i = 0; i < pushTokens.length; i++) {
            const ticket = tickets[i];
            if(ticket.status === "ok") {
                returnTickets.push({
                    ticket: ticket.id,
                    token: pushTokens[i]
                });
            }
            else {
                switch (ticket.details?.error) {
                    case "DeviceNotRegistered":
                        deregisterTokens.push(pushTokens[i])
                        break;
                    case "ExpoError":
                    case "MessageRateExceeded":
                    case "ProviderError":
                        failedTokens.push(pushTokens[i])
                        break;
                    default:
                        // unsolvable error
                        console.error("failed to send push notification", ticket.details?.error);
                }
            }
        }
    } catch (error) {
        failedTokens.push(...pushTokens)
    }

    return {
        deregisterTokens: deregisterTokens,
        failedTokens: failedTokens,
        tickets: returnTickets
    }
}



export const checkTickets = async (tickets: Ticket[]): Promise<ReceiptPushResponse> => {
    const ticketIds = []
    for (const ticket of tickets) {
        ticketIds.push(ticket.ticket);
    }
    const receiptIdChunks = expo.chunkPushNotificationReceiptIds(ticketIds);

    const failedTokens: string[] = [];
    const deregisterTokens: string[] = [];
    const failedReceiptCheck: Ticket[] = [];

    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
        try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receiptId in receipts) {
                let { status, details } = receipts[receiptId];
                if (status === 'ok') {
                    continue;
                } else if (status === 'error') {
                    console.error(
                        `There was an error sending a notification`
                    );

                    let token;
                    // @ts-ignore
                    switch (details?.error) {
                        case "DeviceNotRegistered":
                            token = tickets.find(ticket => ticket.ticket == receiptId)?.token
                            if(token) {
                                deregisterTokens.push(token)
                            }
                            break;
                        case "ExpoError":
                        case "MessageRateExceeded":
                        case "ProviderError":
                            token = tickets.find(ticket => ticket.ticket == receiptId)?.token
                            if(token) {
                                failedTokens.push(token)
                            }
                            break;
                        default:
                            // unsolvable error
                            // @ts-ignore
                            console.error("failed to send push notification", details?.error);
                    }
                }
            }

            // search for receipts not contained in the answer
            for (const chunkElement of chunk) {
                if(!receipts[chunkElement]) {
                    const token = tickets.find(ticket => ticket.ticket == chunkElement)?.token
                    if(token) {
                        failedTokens.push(token)
                    }
                }
            }
        } catch (error) {
            console.error(error);
            for (const chunkElement of chunk) {
                const token = tickets.find(ticket => ticket.ticket == chunkElement)?.token
                if(token) {
                    failedReceiptCheck.push({
                        ticket: chunkElement,
                        token: token
                    })
                }
            }
        }
    }

    return {
        failedTokens: failedTokens,
        deregisterTokens: deregisterTokens,
        failedReceipts: failedReceiptCheck
    }
}
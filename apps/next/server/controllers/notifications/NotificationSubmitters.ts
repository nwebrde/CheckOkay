import { Notification, Recipient } from '../../entities/notifications/Notifications'
import { NotificationSubmitter } from '../../entities/notifications/NotificationSubmitter'
import { addEmail, addPush } from '../../adapters/scheduler/notifications'
import { ChannelType, notificationChannels } from 'db/schema/notificationChannels'
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { users } from 'db/schema/auth'

type ChannelDB = typeof notificationChannels.$inferSelect


export class EmailSubmitter implements NotificationSubmitter {
    recipient: Recipient
    email: string

    constructor(recipient: Recipient, email: string) {
        this.recipient = recipient
        this.email = email;
    }

    async submit(notification: Notification) {
        await addEmail(this.email, this.recipient, notification);
    }
}

export class PushSubmitter implements NotificationSubmitter {
    tokens: string[]

    constructor(tokens: string[]) {
        this.tokens = tokens;
    }

   async submit(notification: Notification) {
        await addPush(this.tokens, notification);
    }
}

/**
 * Collects submitters for a specified recipient.
 * Either uses the provided notificationChannel or loads the notificationChannels from DB for a specified userId
 *
 * @param recipient
 * @param includedTypes ChannelTypes in this array will be included in the returned submitters
 * @param onlyPrimaryEmail If true, only the primary mail address will be added to the returned submitters and all other email addresses are omitted. Only applicable if includedTypes contains EMAIL
 * @param userId Either userId or (notificationChannels & primaryEmailAddress & disabledProfileEmailNotifications) is required
 * @param primaryEmailAddress Either userId or (notificationChannels & primaryEmailAddress & disabledProfileEmailNotifications) is required
 * @param notificationChannels Either userId or (notificationChannels & primaryEmailAddress & disabledProfileEmailNotifications) is required
 * @param disabledProfileEmailNotifications
 */
export const getSubmitters = async (recipient: Recipient, includedTypes: ChannelType[], onlyPrimaryEmail: boolean, userId?: string, primaryEmailAddress?: string, notificationChannels?: ChannelDB[], disabledProfileEmailNotifications = false) => {
    const ERROR_PREFIX = "Error while parsing notification channel from DB: "

    let channels = notificationChannels
    let primaryMail = primaryEmailAddress
    let disableProfileMail = disabledProfileEmailNotifications

    if (!channels) {
        if (!userId) {
            throw new Error(ERROR_PREFIX + "no user id provided")
        }
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                notificationChannels: true
            }
        })

        if (!user) {
            throw new Error(ERROR_PREFIX + "user id not found")
        }

        channels = user.notificationChannels
        primaryMail = user.email
        disableProfileMail = !user.notificationsByEmail
    }

    const submitters: NotificationSubmitter[] = [];

    if(includedTypes.includes(ChannelType.EMAIL)) {
        if(!primaryMail) {
            throw new Error(ERROR_PREFIX + "primary email address must be provided")
        }
        if(!disableProfileMail) {
            submitters.push(new EmailSubmitter(recipient, primaryMail))
        }
    }

    const pushTokens: string[] = [];

    for (const channel of channels) {
        switch (channel.type) {
            case ChannelType.EMAIL:
                if(includedTypes.includes(ChannelType.EMAIL) && !onlyPrimaryEmail) {
                    submitters.push(new EmailSubmitter(recipient, channel.address))
                }
                break;
            case ChannelType.PUSH:
                if(includedTypes.includes(ChannelType.PUSH)) {
                    pushTokens.push(channel.address)
                }
                break;
            default:
                throw new Error("parsing DB email channel failed. Channel is not correctly implemented")
        }
    }

    if(pushTokens.length > 0) {
        submitters.push(new PushSubmitter(pushTokens))
    }

    return submitters
}

/**
 * Returns all submitters of a user
 * e.g. the primary mail address and all notification channels
 *
 * @param recipient
 * @param userId
 * @param primaryEmailAddress
 * @param notificationChannels
 */
export const getAllSubmitters = async (recipient: Recipient, userId?: string, primaryEmailAddress?: string, notificationChannels?: ChannelDB[], disabledProfileEmailNotifications = false) => {
    return await getSubmitters(recipient, [ChannelType.EMAIL, ChannelType.PUSH], false, userId, primaryEmailAddress, notificationChannels, disabledProfileEmailNotifications)
}

/**
 * Returns only the primary mail submitter and submitters for push channels of a user
 */
export const getMainSubmitters = async (recipient: Recipient, userId?: string, primaryEmailAddress?: string, notificationChannels?: ChannelDB[], disabledProfileEmailNotifications = false) => {
    return await getSubmitters(recipient, [ChannelType.EMAIL, ChannelType.PUSH], true, userId, primaryEmailAddress, notificationChannels, disabledProfileEmailNotifications)
}

/**
 * Returns only push channels of a user
 * @param recipient
 * @param userId
 * @param notificationChannels
 */
export const getPushSubmitters = async (recipient: Recipient, userId?: string, notificationChannels?: ChannelDB[]) => {
    return await getSubmitters(recipient, [ChannelType.PUSH], true, userId, undefined, notificationChannels)
}
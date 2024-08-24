import {generate} from "randomstring";
import {db} from "db";
import {invitations} from "db/schema/invitations";
import {eq} from "drizzle-orm";
import {guards} from "db/schema/guards";
import {GuardType} from "app/lib/types/guardUser";
import {users} from "db/schema/auth";
import { NewGuardNotification } from './notifications/ConcreteNotifications'
import { StandardNotifier } from './notifications/ConcreteNotifiers'
import { getMainSubmitters } from './notifications/NotificationSubmitters'
import { Recipient } from '../entities/notifications/Notifications'
import { toExternalUserImage } from '../adapters/db/users'

const INVITATION_EXPIRATION_DAYS = 2

/**
 * Returns the invitation code
 * @param guardedUser - user id
 */
export const invite = async (guardedUserId: string) => {
    for (let i = 0; i < 10; i++) {
        const code = generate({
            readable: true,
        })
        const res = await db.insert(invitations).values({
            code: code,
            guardedUserId: guardedUserId,
        })
        if (res[0].affectedRows > 0) {
            return code
        }
    }
    return undefined
}

export const acceptInvitation = async (code: string, guardUserId: string) => {
    const invitation = await db.query.invitations.findFirst({
        where: eq(invitations.code, code),
        with: {
            guardedUser: {
                with: {
                    notificationChannels: true
                }
            },
        }
    })

    if (!invitation) {
        return false
    }

    const expDate = new Date(invitation.createdAt)
    expDate.setUTCDate(expDate.getUTCDate() + INVITATION_EXPIRATION_DAYS)

    if (new Date() > expDate) {
        return false
    }

    const insertRes = await db.insert(guards).values({
        guardedUserId: invitation.guardedUserId,
        guardUserId: guardUserId,
        priority: GuardType.IMPORTANT,
    })

    if (insertRes[0].affectedRows <= 0) {
        return false
    }

    const deleteRes = await db
    .delete(invitations)
    .where(eq(invitations.code, code))

    if (insertRes[0].affectedRows > 0) {
        const guard = await db.query.users.findFirst({
            where: eq(users.id, guardUserId)
        });

        if(!guard) {
            return false
        }

        const notification = new NewGuardNotification(guard.name ?? guard.email, guard.image ? toExternalUserImage(guard.image) : null);

        const recipient: Recipient = {
            name: invitation.guardedUser.name!
        }
        
        await (new StandardNotifier(notification, await getMainSubmitters(recipient, undefined, invitation.guardedUser.email, invitation.guardedUser.notificationChannels)).submit())

        return true
    }
    return false
}
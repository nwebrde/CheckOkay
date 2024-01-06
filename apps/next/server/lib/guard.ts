import Guard, { GuardType } from './types/gaurd'
import { getUser, toUser } from './user'
import { guards } from 'db/schema/guards'
import type { users } from 'db/schema/auth'
import { generate } from 'randomstring'
import { db } from 'db'
import { invitations } from 'db/schema/invitations'
import { sendNewGuard, sendWarning } from './services/sendEmail'
import moment from 'moment/moment'
import User from './types/user'
import { and, eq } from 'drizzle-orm'
import { Guarded } from './types/gaurd'

type GuardDB = typeof guards.$inferSelect
type UserDB = typeof users.$inferSelect
type GuardWithGuardUserDB = GuardDB & {
    guardUser: UserDB
}

type GuardWithGuardedUserDB = GuardDB & {
    guardedUser: UserDB
}

const INVITATION_EXPIRATION_DAYS = 2

/**
 * Returns the invitation code
 * @param guardedUser - user id
 */
export async function invite(guardedUser: string) {
    for (let i = 0; i < 10; i++) {
        const code = generate({
            readable: true,
        })
        const res = await db.insert(invitations).values({
            code: code,
            guardedUserId: guardedUser,
        })
        if (res[0].affectedRows > 0) {
            return code
        }
    }
    return undefined
}

export async function acceptInvitation(code: string, guardUserId: string) {
    const invitation = await db.query.invitations.findFirst({
        where: eq(invitations.code, code),
    })

    if (!invitation) {
        return false
    }

    const expDate = invitation.createdAt
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
        const guardedUser = await getUser(invitation.guardedUserId)
        const guardUser = await getUser(guardUserId)
        await sendNewGuard(
            guardedUser!.email,
            guardUser!.name ? guardUser!.name : guardUser!.email,
            guardedUser!.name ? guardedUser!.name : guardedUser!.email,
        )
        return true
    }
}

export async function deleteRelation(guardId: string, guardedId: string) {
    const deleteRes = await db
        .delete(guards)
        .where(
            and(
                eq(guards.guardUserId, guardId),
                eq(guards.guardedUserId, guardedId),
            ),
        )
    return deleteRes[0].affectedRows > 0
}

export async function switchType(guardId: string, guardedId: string) {
    let newType = GuardType.BACKUP
    const oldType = await db.query.guards.findFirst({
        where: and(
            eq(guards.guardUserId, guardId),
            eq(guards.guardedUserId, guardedId),
        ),
    })
    if (!oldType) {
        return false
    }
    if (oldType.priority == GuardType.BACKUP) {
        newType = GuardType.IMPORTANT
    }
    const res = await db
        .update(guards)
        .set({ priority: newType })
        .where(
            and(
                eq(guards.guardUserId, guardId),
                eq(guards.guardedUserId, guardedId),
            ),
        )
    return res[0].affectedRows > 0
}

export async function warn(
    guardUser: Guard,
    guardedUser: User,
    lastCheck: Date,
) {
    await sendWarning(
        guardUser.guardUser.email,
        guardUser.guardUser.name
            ? guardUser.guardUser.name
            : guardUser.guardUser.email,
        guardedUser.name ? guardedUser.name : guardedUser.email,
        moment(lastCheck).fromNow(),
    )
}

/**
 * Converts a DB object to corresponding lib type
 * @param guard
 */
export function toGuard(guard: GuardWithGuardUserDB): Guard {
    return {
        priority: guard.priority,
        since: guard.createdAt,
        guardUser: toUser(guard.guardUser),
    }
}
export function toGuards(guards: GuardWithGuardUserDB[]): Guard[] {
    const results: Guard[] = []
    for (const guard of guards) {
        results.push(toGuard(guard))
    }
    return results
}

export function toGuarded(guarded: GuardWithGuardedUserDB): Guarded {
    return {
        priority: guarded.priority,
        since: guarded.createdAt,
        guardedUser: toUser(guarded.guardedUser),
        state: guarded.guardedUser.state,
        lastCheckOkay: new Date(),
        nextOpenCheck: new Date(),
    }
}
export function toGuardedUsers(guards: GuardWithGuardedUserDB[]): Guarded[] {
    const results: Guarded[] = []
    for (const guarded of guards) {
        results.push(toGuarded(guarded))
    }
    return results
}

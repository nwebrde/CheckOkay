import {Guard, GuardType} from "app/lib/types/guardUser";
import {Guarded} from "app/lib/types/guardedUser";
import { getUser, toUser } from './users'
import {guards} from "db/schema/guards";
import {users} from "db/schema/auth";
import {db} from "db";
import {and, eq} from "drizzle-orm";
import { CheckState } from 'app/lib/types/check'

type GuardDB = typeof guards.$inferSelect
type UserDB = typeof users.$inferSelect
type GuardWithGuardUserDB = GuardDB & {
    guardUser: UserDB
}

type GuardWithGuardedUserDB = GuardDB & {
    guardedUser: UserDB
}

export const deleteRelation = async (guardId: string, guardedId: string) => {
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

export const switchType = async (guardId: string, guardedId: string) => {
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

export const pauseWarningsForGuardedUser = async (guardId: string, guardedUserId: string, pause: boolean) => {
    if(pause) {
        const guardedUser = await getUser(guardedUserId, false, false)

        if(!guardedUser) {
            return false
        }

        if(guardedUser.state != CheckState.WARNED && guardedUser.state != CheckState.BACKUP) {
            return false
        }

        const res = await db
        .update(guards)
        .set({ pausedForNextReqCheckInDate: guardedUser.nextRequiredCheckIn })
        .where(
            and(
                eq(guards.guardUserId, guardId),
                eq(guards.guardedUserId, guardedUserId),
            ),
        )
        return res[0].affectedRows > 0
    }
    else {
        const res = await db
        .update(guards)
        .set({ pausedForNextReqCheckInDate: null })
        .where(
            and(
                eq(guards.guardUserId, guardId),
                eq(guards.guardedUserId, guardedUserId),
            ),
        )
        return res[0].affectedRows > 0
    }
}


/**
 * Converts a DB object to corresponding lib type
 * @param guard
 */
export const toGuard = (guard: GuardWithGuardUserDB): Guard => {
    const guardUser = toUser(guard.guardUser)
    return {
        priority: guard.priority,
        since: guard.createdAt,

        id: guard.guardUserId,
        email: guardUser.email,
        name: guardUser.name ?? undefined,
        image: guardUser.image ?? undefined
    }
}


export const toGuards = (guards: GuardWithGuardUserDB[]): Guard[] => {
    const results: Guard[] = []
    for (const guard of guards) {
        results.push(toGuard(guard))
    }
    return results
}

export const toGuarded = (guarded: GuardWithGuardedUserDB): Guarded => {
    const guardedUser = toUser(guarded.guardedUser)
    return {
        priority: guarded.priority,
        since: guarded.createdAt,
        state: guardedUser.state,
        step: guardedUser.step,
        lastCheckIn: guardedUser.lastCheckIn,
        nextRequiredCheckIn: guardedUser.nextRequiredCheckIn,
        pausedForNextReqCheckInDate: guarded.pausedForNextReqCheckInDate ?? undefined,
        id: guardedUser.id,
        email: guardedUser.email,
        name: guardedUser.name,
        image: guardedUser.image
    }
}
export const toGuardedUsers = (guards: GuardWithGuardedUserDB[]): Guarded[] => {
    const results: Guarded[] = []
    for (const guarded of guards) {
        results.push(toGuarded(guarded))
    }
    return results
}
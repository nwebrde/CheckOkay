import User from './types/user'
import { eq } from 'drizzle-orm'
import { convertLastCheckOkay, toChecks } from './checks/check'
import { toGuardedUsers, toGuards } from './guard'
import { db } from 'db'
import { users } from 'db/schema/auth'
import { checks } from 'db/schema/checks'
import { and } from 'drizzle-orm/index'
import { updateEventTiming } from './services/cronicleClient'

type UserDB = typeof users.$inferSelect

export async function getUser(
    userId: string,
    withChecks?: boolean,
    withGuards?: boolean,
    withGuardedUsers?: boolean,
) {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            checks: !withChecks ? undefined : true,
            guards: !withGuards ? undefined : { with: { guardUser: true } },
            guardedUsers: !withGuardedUsers
                ? undefined
                : { with: { guardedUser: true } },
        },
    })

    if (user) {
        const returnUser: User = {
            ...toUser(user),
            checks: !withChecks ? undefined : toChecks(user.checks),
            // @ts-ignore
            guards: !withGuards ? undefined : toGuards(user.guards),
            guardedUsers: !withGuardedUsers
                ? undefined
                : // @ts-ignore
                  toGuardedUsers(user.guardedUsers),
        }

        return returnUser
    }

    return undefined
}

/**
 * Converts a DB object to corresponding lib type
 * @param user
 */
export function toUser(user: UserDB): User {
    const lastCheck = convertLastCheckOkay(
        user.lastManualCheck,
        user.lastStepCheck,
    )
    return {
        ...user,
        name: user.name ?? undefined,
        emailVerified: user.emailVerified != null,
        image: user.image ?? undefined,
        step: lastCheck.step,
        lastCheckOkay: lastCheck.latestCheck,
        nextRequiredCheckDate: user.nextRequiredCheckDate ?? undefined,
        checks: undefined,
        guards: undefined,
    }
}

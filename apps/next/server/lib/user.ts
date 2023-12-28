import User from './types/user'
import { eq } from 'drizzle-orm'
import { toChecks } from './check'
import { toGuards } from './guard'
import { db } from 'db'
import { users } from 'db/schema/auth'

type UserDB = typeof users.$inferSelect

export async function getUser(
  userId: string,
  withChecks?: boolean,
  withGuards?: boolean,
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      checks: !withChecks ? undefined : true,
      guards: !withGuards ? undefined : { with: { guardUser: true } },
    },
  })

  if (user) {
    const returnUser: User = {
      ...toUser(user),
      checks: !withChecks ? undefined : toChecks(user.checks),
      // @ts-ignore
      guards: !withGuards ? undefined : toGuards(user.guards),
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
  return {
    ...user,
    name: user.name ? user.name : undefined,
    emailVerified: user.emailVerified != null,
    image: user.image ? user.image : undefined,
    lastManualCheck: user.lastManualCheck ? user.lastManualCheck : undefined,
    lastStepCheck: user.lastStepCheck ? user.lastStepCheck : undefined,
    checks: undefined,
    guards: undefined,
  }
}

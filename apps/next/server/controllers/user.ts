import { db } from 'db'
import { eq } from 'drizzle-orm'
import { accounts, sessions, users } from 'db/schema/auth'
import { deleteCurrentProfileImage } from './profileImage'
import { deleteCheck } from '../adapters/scheduler/checks'
import { deleteRepeatingNotifier } from '../adapters/scheduler/repeatingNotifiers'

export const deleteUser = async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    })

    if(!user) {
        throw new Error("User not found. User was not deleted.")
    }

    await deleteCurrentProfileImage(userId, false);
    if(user.currentCheckId) {
        await deleteCheck(user.currentCheckId)
    }
    await deleteRepeatingNotifier(userId)
    await db.delete(users).where(eq(users.id, userId))
    await db.delete(sessions).where(eq(sessions.userId, userId))
    await db.delete(accounts).where(eq(accounts.userId, userId))
    return true
}
import { db } from 'db'
import { eq } from 'drizzle-orm'
import { accounts, sessions, users } from 'db/schema/auth'
import { deleteCurrentProfileImage } from './profileImage'
import { deleteCheck } from '../adapters/scheduler/checks'
import { deleteRepeatingNotifier } from '../adapters/scheduler/repeatingNotifiers'

export const deleteUser = async (userId: string) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            accounts: true
        }
    })

    if(!user) {
        throw new Error("User not found. User was not deleted.")
    }

    await deleteCurrentProfileImage(userId, false);
    if(user.currentCheckId) {
        await deleteCheck(user.currentCheckId)
    }
    await deleteRepeatingNotifier(userId)

    // Deregister user from apple
    if(user.accounts[0].provider == "apple") {
        let token = undefined
        let type = "refresh_token"
        if(user.accounts[0].refresh_token !== "") {
            token = user.accounts[0].refresh_token
        }
        else {
            token = user.accounts[0].access_token
            type = "access_token"
        }

        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append('client_id', process.env.APPLE_CLIENT_ID!);
        urlEncodedData.append('client_secret', process.env.APPLE_CLIENT_SECRET!);
        urlEncodedData.append('token', token ?? "");
        urlEncodedData.append('token_type_hint', type);

        try {
            const response = await fetch('https://appleid.apple.com/auth/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData.toString(),
            });

            const result = await response.json();
        } catch (e) {
        }
    }

    await db.delete(users).where(eq(users.id, userId))
    await db.delete(sessions).where(eq(sessions.userId, userId))
    await db.delete(accounts).where(eq(accounts.userId, userId))
    return true
}
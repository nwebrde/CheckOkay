import {users} from "db/schema/auth";
import {User} from "app/lib/types/user";
import {toHourMinute} from "./checks";
import {db} from "db";
import {eq} from "drizzle-orm";
import {toGuardedUsers, toGuards} from "./guards";
import {CheckState} from "app/lib/types/check";

type UserDB = typeof users.$inferSelect

export const getUser = async (userId: string, withGuards: boolean, withGuardedUsers: boolean) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        with: {
            guardedUsers: {with: {guardedUser: true}},
            guards: {with: {guardUser: true}}
        },
    })

    if (user) {
        return {
            ...toUser(user),
            guards: toGuards(user.guards),
            guardedUsers: toGuardedUsers(user.guardedUsers)
        }
    }
    return undefined
}

export const updateNextRequiredCheckIn = async (userId: string, nextRequiredCheckIn: Date | null, nextCheckId: number | null, nextCheckInPossibleFrom: Date | null) => {
    const res = await db.update(users).set({nextRequiredCheckDate: nextRequiredCheckIn, currentCheckId: nextCheckId, nextCheckInPossibleFrom: nextCheckInPossibleFrom}).where(eq(users.id, userId))
    return res[0].affectedRows > 0
}

export const updateCheckState = async (userId: string, checkState: CheckState) => {
    const res = await db.update(users).set({state: checkState}).where(eq(users.id, userId))
    return res[0].affectedRows > 0
}

export const setUserName = async (userId: string, name: string) => {
    const res = await db.update(users).set({name: name}).where(eq(users.id, userId))
    return res[0].affectedRows > 0
}

/**
 * Converts a DB object to corresponding User type
 * @param user
 */
export const toUser = (user: UserDB): User => {
    return {
        id: user.id,
        name: user.name ?? undefined,
        email: user.email,
        image: user.image ? (process.env.S3_DOWNLOAD_URL + "/" + (process.env.S3_PROFILE_IMAGE_DIR ? (process.env.S3_PROFILE_IMAGE_DIR + "/") : "") + user.image) : undefined,
        state: user.state,
        step: isLastCheckInByStep(user.lastManualCheck, user.lastStepCheck),
        lastCheckIn: getLastCheckIn(user.lastManualCheck, user.lastStepCheck),
        nextRequiredCheckIn: user.nextRequiredCheckDate ?? undefined,
        nextCheckInPossibleFrom: user.nextCheckInPossibleFrom ?? undefined
    }
}


export const toSeconds = (time: string): number => {
    const hourMinute = toHourMinute(time)
    return hourMinute.hour * 60 * 60 + hourMinute.minute * 60;
}

/**
 * extracts the last check in date from a db user
 * @param lastManualCheck db field
 * @param lastStepCheck db field
 */
export const getLastCheckIn = (
    lastManualCheck: Date | null | undefined,
    lastStepCheck: Date | null | undefined,
) => {
    let latest = lastManualCheck
    if (lastStepCheck) {
        if (!latest) {
            latest = lastStepCheck
        } else if (lastStepCheck > lastManualCheck!) {
            latest = lastStepCheck
        }
    }
    return latest ?? undefined
}

/**
 * extracts whether the last check in was performed manually or automatically
 * @param lastManualCheck db field
 * @param lastStepCheck db field
 */
const isLastCheckInByStep = (
    lastManualCheck: Date | null | undefined,
    lastStepCheck: Date | null | undefined,
) => {
    let step = false
    if (lastStepCheck) {
        if (!lastManualCheck) {
            step = true
        } else if (lastStepCheck > lastManualCheck!) {
            step = true
        }
    }
    return step
}
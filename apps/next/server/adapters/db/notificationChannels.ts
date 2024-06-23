import {db} from "db";
import { and, eq, inArray } from 'drizzle-orm'
import {ChannelType, notificationChannels} from "db/schema/notificationChannels";
import { checks } from 'db/schema/checks'


export const addChannel = async (userId: string, address: string, type: ChannelType) => {
    const res = await db.insert(notificationChannels).values({
        userId: userId,
        address: address,
        type: type
    })

    return res[0].affectedRows > 0
}

export const removeChannel = async (userId: string, address: string) => {
    const res = await db.delete(notificationChannels).where(and(eq(notificationChannels.address, address), eq(notificationChannels.userId, userId)))

    return res[0].affectedRows > 0
}

export const removePushTokens = async (tokens: string[]) => {
    const res = await db.delete(notificationChannels).where(and(inArray(notificationChannels.address, tokens), eq(notificationChannels.type, ChannelType.PUSH)))

    return res[0].affectedRows > 0
}

export const getChannels = async (userId: string) => {
    const res = await db.query.notificationChannels.findMany({
        where: eq(notificationChannels.userId, userId)
    })

    const returnArray = [];
    for (const elem of res) {
        returnArray.push(
            {
                address: elem.address,
                type: elem.type
            }
        )
    }
    return returnArray;
}
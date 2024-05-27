import {db} from "db";
import {and, eq} from "drizzle-orm";
import {ChannelType, notificationChannels} from "db/schema/notificationChannels";


export const addChannel = async (userId: string, address: string, type: ChannelType) => {
    const res = await db.insert(notificationChannels).values({
        userId: userId,
        address: address,
        type: type
    })

    return res[0].affectedRows > 0 ? res[0].insertId : false
}

export const removeChannel = async (userId: string, id: number) => {
    const res = await db.delete(notificationChannels).where(and(eq(notificationChannels.id, id), eq(notificationChannels.userId, userId)))

    return res[0].affectedRows > 0
}
import {z} from "zod";
import { ChannelType } from 'db/schema/notificationChannels'

export const ZNotificationChannel = z.object({
    address: z.string(),
    type: z.nativeEnum(ChannelType)
})

export type NotificationChannel = z.infer<typeof ZNotificationChannel>;
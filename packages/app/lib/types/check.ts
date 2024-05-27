import {z} from "zod";

export const ZCheck = z.object({
    hour: z.number().gte(0).lt(24),
    minute: z.number().gte(0).lt(60),
    id: z.number()
})

export type Check = z.infer<typeof ZCheck>;

export enum CheckState {
    OK = 'OK', // else
    NOTIFIED = 'NOTIFIED', // if not responded to a check notification, but check time not exceeded yet
    WARNED = 'WARNED', // if check time is exceeded
    BACKUP = 'BACKUP',
}
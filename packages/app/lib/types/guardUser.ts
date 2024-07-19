import {z} from "zod";
import {ZProfile} from "app/lib/types/userProfile";

export enum GuardType {
    IMPORTANT = 'important',
    BACKUP = 'backup',
}

export const ZGuard = ZProfile.merge(z.object({
    priority: z.nativeEnum(GuardType),
    since: z.date()
}))

export type Guard = z.infer<typeof ZGuard>;

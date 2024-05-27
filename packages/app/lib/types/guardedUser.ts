import {CheckState} from "app/lib/types/check";
import {GuardType, ZGuard} from "app/lib/types/guardUser";
import {z} from "zod";
import {ZProfile} from "app/lib/types/userProfile";


export const ZGuarded = ZProfile.merge(z.object({
    since: z.date(),
    priority: z.nativeEnum(GuardType),
    state: z.nativeEnum(CheckState),
    lastCheckIn: z.date().optional(),
    step: z.boolean().optional(),
    nextRequiredCheckIn: z.date().optional()
}))

export type Guarded = z.infer<typeof ZGuarded>;

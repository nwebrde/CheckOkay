import {CheckState} from "app/lib/types/check";
import {z} from "zod";
import {ZProfile} from "app/lib/types/userProfile";

export const ZUser = ZProfile.merge(z.object({
    state: z.nativeEnum(CheckState),
    lastCheckIn: z.date().optional(),
    step: z.boolean().optional(),
    nextRequiredCheckIn: z.date().optional(),
}));

export type User = z.infer<typeof ZUser>;
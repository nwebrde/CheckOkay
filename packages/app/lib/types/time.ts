import {z} from "zod";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

// 0 - 59
export type Minute = IntRange<0, 60>

// 0 - 23
export type Hour = IntRange<0, 24>

export const ZTime = z.object({
    hour: z.number().lt(24).gte(0),
    minute: z.number().lt(60).gte(0),
})

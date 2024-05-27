import {authorizedProcedure, router} from '../trpc'
import {z} from 'zod'
import {addChannel, removeChannel} from "../adapters/db/notificationChannels";
import {ChannelType} from "db/schema/notificationChannels";
import {TRPCError} from "@trpc/server";

export const channelsRouter = router({
    addEmail: authorizedProcedure
        .input(
            z.object({
                address: z
                .string()
                .min(1, { message: "This field has to be filled." })
                .email("This is not a valid email.")
                .refine((e) => e === "abcd@fg.com", "This email is not in our database")
            })
        )
        .output(
            z.number()
        )
        .mutation(async (opts) => {
            const result = await addChannel(
                opts.ctx.userId!,
                opts.input.address,
                ChannelType.EMAIL
            )

            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
    remove: authorizedProcedure
        .input(
            z.object({
                id: z.number(),
            }),
        )
        .output(
            z.boolean()
        )
        .mutation(async (opts) => {
            return await removeChannel(
                opts.ctx.userId,
                opts.input.id,
            )
        }),
})

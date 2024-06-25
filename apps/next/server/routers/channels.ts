import {authorizedProcedure, router} from '../trpc'
import {z} from 'zod'
import { addChannel, getChannels, removeChannel } from '../adapters/db/notificationChannels'
import {ChannelType} from "db/schema/notificationChannels";
import {TRPCError} from "@trpc/server";
import { getChecks } from '../adapters/db/checks'
import { ZNotificationChannel } from 'app/lib/types/notificationChannels'

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
        }),
    addPush: authorizedProcedure
    .input(
        z.object({
            token: z
            .string()
        })
    )

    .mutation(async (opts) => {
        const result = await addChannel(
            opts.ctx.userId!,
            opts.input.token,
            ChannelType.PUSH
        )

        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
    }),
    remove: authorizedProcedure
        .input(
            z.object({
                address: z.string(),
            }),
        )
        .output(
            z.boolean()
        )
        .mutation(async (opts) => {
            return await removeChannel(
                opts.ctx.userId,
                opts.input.address,
            )
        }),
    get: authorizedProcedure.output(z.array(ZNotificationChannel)).query(async (opts) => {
        return getChannels(opts.ctx.userId!)
    }),
})

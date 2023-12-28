import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import { addCheck } from '../lib/check'
import { TRPCError } from '@trpc/server'

export const checksRouter = router({
    addCheck: authorizedProcedure
        .input(
            z.object({
                hour: z.number(),
                minute: z.number(),
            }),
        )
        .mutation(async (opts) => {
            const result = await addCheck(
                opts.ctx.userId!,
                opts.input.hour,
                opts.input.minute,
            )
            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
    test: authorizedProcedure.query(async (opts) => {
        return opts.ctx.userId
    }),
})

import { authorizedProcedure, router } from '../trpc'
import { checksRouter } from './checks'
import { guardsRouter } from './guards'
import { getUser } from '../lib/user'
import { TRPCError } from '@trpc/server'

export const appRouter = router({
    getUser: authorizedProcedure.query(async (opts) => {
        const result = await getUser(opts.ctx.userId!, false, true, true)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    }),
    checks: checksRouter,
    guards: guardsRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter

import { authorizedProcedure, publicProcedure, router } from '../trpc'
import { z } from 'zod'
import { checksRouter } from './checks'

export const appRouter = router({
    getUser: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query((opts) => 'hello tRPC v10!'),
    updateChecks: publicProcedure.query(() => 'hello tRPC v10!'),
    greeting: publicProcedure.query(() => 'hello tRPC v10!'),
    hello: authorizedProcedure
        .input(
            z.object({
                text: z.string(),
            }),
        )
        .query((opts) => {
            return {
                greeting: `hello ${opts.input.text} and your user id is ${opts.ctx.userId}`,
            }
        }),
    checks: checksRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter

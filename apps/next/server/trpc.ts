import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'
import superjson from 'superjson';

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
    transformer: superjson,
})
// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

const isAuthed = t.middleware((opts) => {
    const { ctx } = opts
    if (!ctx.userId) {
        // by throwing an UNAUTHORIZED error, the trpc client fetches a new access token and retries the failed request
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return opts.next({
        ctx: {
            userId: ctx.userId,
        },
    })
})

export const authorizedProcedure = publicProcedure.use(isAuthed)

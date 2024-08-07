import {authorizedProcedure, router} from '../trpc'
import {checksRouter} from './checks'
import {guardsRouter} from './guards'
import {TRPCError} from '@trpc/server'
import {z} from "zod";
import {ZUser} from "app/lib/types/user";
import {getUser} from "../adapters/db/users";
import {ZGuard} from "app/lib/types/guardUser";
import {ZGuarded} from "app/lib/types/guardedUser";
import { channelsRouter } from './channels'
import { userRouter } from './user'

export const appRouter = router({
    getUser: authorizedProcedure.output(
        ZUser.merge(z.object({
            guards: z.array(ZGuard),
            guardedUsers: z.array(ZGuarded)
        })),
    ).query(async (opts) => {
        const result = await getUser(opts.ctx.userId!, true, true)

        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    }),

    checks: checksRouter,
    guards: guardsRouter,
    channels: channelsRouter,
    user: userRouter
})
// export type definition of API
export type AppRouter = typeof appRouter

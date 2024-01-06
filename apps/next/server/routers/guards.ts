import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { deleteRelation, invite, switchType } from '../lib/guard'
import { getChecks } from '../lib/checks/check'
import { getUser } from '../lib/user'

export const guardsRouter = router({
    invite: authorizedProcedure.mutation(async (opts) => {
        const result = await invite(opts.ctx.userId!)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return process.env.API_ENDPOINT + '/invite?code=' + result
    }),
    getGuardedUsers: authorizedProcedure.query(async (opts) => {
        const result = await getUser(opts.ctx.userId!, false, false, true)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result.guardedUsers!
    }),
    getGuards: authorizedProcedure.query(async (opts) => {
        const result = await getUser(opts.ctx.userId!, false, true)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result.guards!
    }),
    delete: authorizedProcedure
        .input(
            z.object({
                guardUserId: z.string(),
            }),
        )
        .mutation(async (opts) => {
            const result = await deleteRelation(
                opts.input.guardUserId,
                opts.ctx.userId!,
            )
            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
    switchType: authorizedProcedure
        .input(
            z.object({
                guardUserId: z.string(),
            }),
        )
        .mutation(async (opts) => {
            const result = await switchType(
                opts.input.guardUserId,
                opts.ctx.userId!,
            )
            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
})

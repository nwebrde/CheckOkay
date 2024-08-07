import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {deleteRelation, switchType} from "../adapters/db/guards";
import {invite} from "../controllers/invitations";

export const guardsRouter = router({
    invite: authorizedProcedure.output(z.string()).mutation(async (opts) => {
        const result = await invite(opts.ctx.userId!)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return process.env.API_ENDPOINT + '/invite?code=' + result
    }),
    deleteGuard: authorizedProcedure
        .input(
            z.object({
                guardUserId: z.string(),
            }),
        ).output(z.boolean()).mutation(async (opts) => {
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
    deleteGuardedUser: authorizedProcedure
        .input(
            z.object({
                guardedUserId: z.string(),
            }),
        ).output(z.boolean())
        .mutation(async (opts) => {
            const result = await deleteRelation(
                opts.ctx.userId!,
                opts.input.guardedUserId,
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
        ).output(z.boolean())
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

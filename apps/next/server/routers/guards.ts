import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { deleteRelation, pauseWarningsForGuardedUser, switchType } from '../adapters/db/guards'
import {invite} from "../controllers/invitations";
import { setProfileImage } from '../controllers/profileImage'
import { checkIn } from '../controllers/checks'
import { hasGuardedUser } from '../adapters/db/users'
import * as Sentry from '@sentry/nextjs'

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
    checkInForGuardedUser: authorizedProcedure.input(z.object({
        guardedUserId: z.string(),
    })).mutation(async (opts) => {
        Sentry.captureMessage("called with data: " + opts.input.guardedUserId + " & " +  opts.ctx.userId ?? "");
        if(await hasGuardedUser(opts.ctx.userId!, opts.input.guardedUserId)) {
            await checkIn(opts.input.guardedUserId, false, true)
        }
        else {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
    }),
    pauseWarningsForGuardedUser: authorizedProcedure.input(z.object({
        guardedUserId: z.string(),
        pause: z.boolean()
    })).output(z.boolean()).mutation(async (opts) => {
        const result = await pauseWarningsForGuardedUser(opts.ctx.userId!, opts.input.guardedUserId, opts.input.pause)

        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    }),
})

import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import {
    addCheck,
    checkOkay,
    getChecks,
    getCheckSettings,
    getLastCheckOkay,
    modifyCheck,
    removeCheck,
} from '../lib/checks/check'
import { TRPCError } from '@trpc/server'
import {
    setNotifyBackupAfter,
    setReminderBeforeCheck,
} from '../lib/checks/checkSettings'

export const checksRouter = router({
    add: authorizedProcedure
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
    modify: authorizedProcedure
        .input(
            z.object({
                checkId: z.string(),
                hour: z.number(),
                minute: z.number(),
            }),
        )
        .mutation(async (opts) => {
            const result = await modifyCheck(
                opts.input.checkId,
                opts.input.hour,
                opts.input.minute,
                opts.ctx.userId,
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
                checkId: z.string(),
            }),
        )
        .mutation(async (opts) => {
            const result = await removeCheck(
                opts.input.checkId,
                opts.ctx.userId,
            )
            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
    get: authorizedProcedure.query(async (opts) => {
        const result = await getChecks(opts.ctx.userId!)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    }),
    getSettings: authorizedProcedure.query(async (opts) => {
        const result = await getCheckSettings(opts.ctx.userId!)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    }),
    getLastCheckOkay: authorizedProcedure.query(async (opts) => {
        const result = await getLastCheckOkay(opts.ctx.userId!)
        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    }),
    checkOkay: authorizedProcedure
        .input(
            z.object({
                step: z.boolean(),
            }),
        )
        .mutation(async (opts) => {
            const result = await checkOkay(opts.ctx.userId!, opts.input.step)
            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
    modifyReminderBeforeCheck: authorizedProcedure
        .input(
            z.object({
                hour: z.number(),
                minute: z.number(),
            }),
        )
        .mutation(async (opts) => {
            const result = await setReminderBeforeCheck(
                opts.input.hour,
                opts.input.minute,
                opts.ctx.userId,
            )
            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
    modifyNotifyBackupAfter: authorizedProcedure
        .input(
            z.object({
                hour: z.number(),
                minute: z.number(),
            }),
        )
        .mutation(async (opts) => {
            const result = await setNotifyBackupAfter(
                opts.input.hour,
                opts.input.minute,
                opts.ctx.userId,
            )
            if (!result) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                })
            }
            return result
        }),
})

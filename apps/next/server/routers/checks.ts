import { authorizedProcedure, router } from '../trpc'
import {z} from 'zod'
import { TRPCError } from '@trpc/server'
import {getChecks} from "../adapters/db/checks";
import {ZCheck} from "app/lib/types/check";
import {
    addCheck,
    changeBackupTime,
    changeReminderTime,
    checkIn,
    getCheckSettings,
    modifyCheck,
    removeCheck
} from "../controllers/checks";
import {Hour, Minute, ZTime} from "app/lib/types/time";

export const checksRouter = router({
    add: authorizedProcedure
        .input(
            ZTime
        )
        .output(
            z.boolean()
        )
        .mutation(async (opts) => {
            return await addCheck(
                opts.ctx.userId!,
                <Hour>opts.input.hour,
                <Minute>opts.input.minute,
            )
        }),
    modify: authorizedProcedure
        .input(
            ZTime.merge(z.object({
                checkId: z.number()}))
        )
        .output(
            z.boolean()
        )
        .mutation(async (opts) => {
            return await modifyCheck(
                opts.ctx.userId,
                opts.input.checkId,
                <Hour>opts.input.hour,
                <Minute>opts.input.minute,
            )
        }),
    remove: authorizedProcedure
        .input(
            z.object({
                checkId: z.number(),
            }),
        )
        .output(
            z.boolean()
        )
        .mutation(async (opts) => {
            return await removeCheck(
                opts.ctx.userId,
                opts.input.checkId,
            )
        }),
    get: authorizedProcedure
    .output(z.array(ZCheck))
    .query(async (opts) => {
        return await getChecks(opts.ctx.userId!)
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
    checkIn: authorizedProcedure
        .input(
            z.object({
                step: z.boolean(),
                date: z.date().optional()
            }),
        )
        .mutation(async (opts) => {
            const result = await checkIn(opts.ctx.userId!, opts.input.step, false, opts.input.date, opts.ctx.userId)
        }),
    modifyReminderBeforeCheck: authorizedProcedure
        .input(
            ZTime
        )
        .mutation(async (opts) => {
            return await changeReminderTime(
                opts.ctx.userId,
                <Hour>opts.input.hour,
                <Minute>opts.input.minute
            )
        }),
    modifyNotifyBackupAfter: authorizedProcedure
        .input(
            ZTime
        )
        .mutation(async (opts) => {
            return await changeBackupTime(
                opts.ctx.userId,
                <Hour>opts.input.hour,
                <Minute>opts.input.minute,
            )
        }),
})

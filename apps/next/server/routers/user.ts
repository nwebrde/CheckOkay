import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import { deleteCurrentProfileImage, getUploadUrl, setProfileImage } from '../controllers/profileImage'
import { TRPCError } from '@trpc/server'
import { NextResponse } from 'next/server'
import { setUserName } from '../adapters/db/users'

export const userRouter = router({
    setProfileImage: authorizedProcedure.input(z.object({
        key: z.string(),
    })).output(z.boolean()).mutation(async (opts) => {
        const result = await setProfileImage(opts.ctx.userId!, opts.input.key)

        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    }),
    getUploadUrl: authorizedProcedure.output(z.object(
        {
            uploadUrl: z.string(),
            key: z.string()
        }
    )).mutation(async (opts) => {
        const {uploadUrl, key} = await getUploadUrl()
        if(!uploadUrl) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Upload URL could not be issued',
            })
        }
        return {uploadUrl, key}
    }),
    deleteProfileImage: authorizedProcedure.mutation(async (opts) => {
        await deleteCurrentProfileImage(opts.ctx.userId!, true)
    }),
    setName: authorizedProcedure.output(z.boolean()).input(z.object({
        name: z.string()
    })).mutation(async (opts) => {
        const result = await setUserName(opts.ctx.userId!, opts.input.name)

        if (!result) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
            })
        }
        return result
    })
});
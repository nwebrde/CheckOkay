import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import { deleteCurrentProfileImage, getUploadUrl, setProfileImage } from '../controllers/profileImage'
import { TRPCError } from '@trpc/server'
import { NextResponse } from 'next/server'

export const profileImageRouter = router({
    set: authorizedProcedure.input(z.object({
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
    delete: authorizedProcedure.mutation(async (opts) => {
        await deleteCurrentProfileImage(opts.ctx.userId!)
    })
});
import { authorizedProcedure, router } from '../trpc'
import { z } from 'zod'
import { getUploadUrl, setProfileImage } from '../controllers/profileImage'
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
        return {uploadUrl, key}
    })
});
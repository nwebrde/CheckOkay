import { NextRequest, NextResponse } from 'next/server'
import { getUploadUrl } from '../../../server/controllers/profileImage'

export async function POST(req: NextRequest) {
    const {uploadUrl, key} = await getUploadUrl()
    return NextResponse.json({ uploadUrl, key}, { status: 200 })
}
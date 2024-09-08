import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    console.error("new background data", req.headers.get("steps"), req.headers.get("accessToken"))
    return new Response('invitation code not found or expired', {
        status: 200,
    })
}
import { NextRequest } from 'next/server'
export async function GET(req: NextRequest) {
    return new Response('no direct api access allowed', {
        status: 200,
    })
}

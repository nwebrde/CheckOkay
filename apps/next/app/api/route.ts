import { NextRequest } from 'next/server'
export async function GET(req: NextRequest) {
    return new Response('direct api access is not allowed')
}

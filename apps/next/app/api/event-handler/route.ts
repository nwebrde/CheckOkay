import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { handleEvent } from '../../../server/lib/checks/check'

export async function POST(req: NextRequest) {
    const userId = req.headers.get('User-Id')
    const res = await handleEvent(userId!)
    if (res) {
        return new Response('success', {
            status: 200,
        })
    }
    return new Response('failure', {
        status: 500,
    })
}

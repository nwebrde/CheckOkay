import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
//@ts-ignore
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../server/lib/nextAuthOptions'
import {acceptInvitation} from "../../../server/controllers/invitations";
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code')
    if (!code) {
        return redirect(`/`)
    }
    const token = await getToken({ req })
    if (token) {
        if (await acceptInvitation(code, token.sub)) {
            return redirect(`/`)
        }
        return new Response('invitation code not found or expired', {
            status: 200,
        })
    } else {
        const url = encodeURIComponent('/api/invite?code=' + code)
        return redirect(`/api/auth/signin?callbackUrl=${url}`)
    }
}

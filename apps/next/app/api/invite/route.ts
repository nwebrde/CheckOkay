import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
//@ts-ignore
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../server/lib/nextAuthOptions'
import {acceptInvitation} from "../../../server/controllers/invitations";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code')
    if (!code) {
        return redirect(`/`)
    }
    const session = await getServerSession(authOptions)
    if (session) {
        const user = session.user
        if (await acceptInvitation(code, user.id)) {
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

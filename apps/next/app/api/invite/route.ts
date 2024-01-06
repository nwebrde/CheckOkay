import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
//@ts-ignore
import { getServerSession } from 'next-auth'
import { acceptInvitation } from '../../../server/lib/guard'
import { authOptions } from '../auth/[...nextauth]/route'

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
        const url = encodeURIComponent(req.nextUrl.toString())
        return redirect(`/api/auth/signin?callbackUrl=${url}`)
    }
}

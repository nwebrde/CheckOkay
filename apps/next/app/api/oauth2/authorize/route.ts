import {
    authorizationServer,
    handleError,
    handleResponse,
} from '../../../../server/lib/typescirpt-node-oauth-server'
import { NextRequest, NextResponse } from 'next/server'
//@ts-ignore
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../server/lib/nextAuthOptions'

export async function GET(req: NextRequest) {
    const query = Object.fromEntries(req.nextUrl.searchParams)
    const bodyParams = new URLSearchParams(await req.text())
    const body = Object.fromEntries(bodyParams)
    try {
        // Validate the HTTP request and return an AuthorizationRequest.
        const authRequest =
            await authorizationServer.validateAuthorizationRequest({
                headers: req.headers,
                body: body,
                query: query,
            })

        const session = await getServerSession(authOptions())
        if (session) {
            // Signed in
            authRequest.user = session.user

            // Once the user has approved or denied the client update the status
            // (true = approved, false = denied)
            authRequest.isAuthorizationApproved = true
            const oauthResponse =
                await authorizationServer.completeAuthorizationRequest(
                    authRequest,
                )
            return handleResponse(oauthResponse)
        } else {
            const url = encodeURIComponent(process.env.NEXTAUTH_URL + req.nextUrl.pathname + req.nextUrl.search)
            return NextResponse.redirect(process.env.NEXTAUTH_URL + `/api/auth/signin?callbackUrl=${url}`)
        }
    } catch (e) {
        console.error(e)
        return handleError(e)
    }
}

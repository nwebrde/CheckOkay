import {
    authorizationServer,
    handleError,
    handleResponse,
    jwtService,
} from '../../../../server/lib/typescirpt-node-oauth-server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    const query = Object.fromEntries(req.nextUrl.searchParams)
    const bodyParams = new URLSearchParams(await req.text())
    const body = Object.fromEntries(bodyParams)

    try {
        const oauthResponse =
            await authorizationServer.respondToAccessTokenRequest({
                headers: req.headers,
                body: body,
                query: query,
            })
        return handleResponse(oauthResponse)
    } catch (e) {
        console.error(e)
        return handleError(e)
    }
}

import { NextRequest } from 'next/server'
import {
    authorizationServer,
    handleError,
    handleResponse,
} from '../../../../../server/lib/typescirpt-node-oauth-server'

export async function POST(req: NextRequest) {
    const query = Object.fromEntries(req.nextUrl.searchParams)
    const bodyParams = new URLSearchParams(await req.text())
    const body = Object.fromEntries(bodyParams)

    try {
        const oauthResponse = await authorizationServer.revoke({
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

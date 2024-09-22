import { NextRequest } from 'next/server'
import { jwtService } from '../../../server/lib/typescirpt-node-oauth-server'
import { checkIn } from '../../../server/controllers/checks'
import { TokenRepository } from '../../../server/lib/typescirpt-node-oauth-server/repositories'

export async function POST(req: NextRequest) {
    const token = req.headers.get("refreshToken");
    const steps = Number(req.headers.get("steps"));
    const startTime = Number(req.headers.get("startTime"));
    const startDate = new Date(startTime)

    let state = false

    console.error("new background data", steps, token)

    let user;

    if(token) {
        try {
            const repo = new TokenRepository()
            const decodedToken = await jwtService.verify(token)

            // @ts-ignore
            user = await repo.getByRefreshToken(decodedToken.refresh_token_id)
            if(user.refreshTokenExpiresAt && user.refreshTokenExpiresAt.getTime() >= (new Date()).getTime()) {
                state = true
            }
        } catch (e) {
            state = false
        }
    }

    if(state && user && user.user) {
        try {
            await checkIn((user.user.id).toString(), true, false, startDate)
            return new Response('checked-in', {
                status: 200,
            })
        }
        catch (e) {
            return new Response('check in not possible with this date', {
                status: 500,
            })
        }
    }
    else {
        return new Response('not authenticated', {
            status: 401,
        })
    }
}
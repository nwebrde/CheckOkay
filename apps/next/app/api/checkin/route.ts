import { NextRequest } from 'next/server'
import { jwtService } from '../../../server/lib/typescirpt-node-oauth-server'
import { checkIn } from '../../../server/controllers/checks'

export async function POST(req: NextRequest) {
    const token = req.headers.get("accessToken");
    const steps = Number(req.headers.get("steps"));
    const startTime = Number(req.headers.get("startTime"));
    const startDate = new Date(startTime)

    let state = true

    console.error("new background data", steps, token)

    let decodedToken;

    if(token) {
        try {
            decodedToken = jwtService.decode(token)
        } catch (e) {
            state = false
        }

        if (!decodedToken || !decodedToken["exp"] || !decodedToken["sub"]) {
            state = false
        }

        // if access token expires in the next 10 sec
        if (state && ((Date.now() - decodedToken["exp"]!) <= (24 * 60 * 60 * 1000))) {
            return true
        }
    }

    if(state) {
        await checkIn(decodedToken["sub"], true, false, startDate)
        return new Response('checked-in', {
            status: 200,
        })
    }
    else {
        return new Response('not authenticated', {
            status: 401,
        })
    }
}
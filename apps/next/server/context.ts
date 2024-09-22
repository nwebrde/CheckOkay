import { FetchCreateContextFnOptions } from '@trpc/server/dist/adapters/fetch'
import { jwtService } from './lib/typescirpt-node-oauth-server'
//@ts-ignore
import { getServerSession } from 'next-auth'
import { authOptions } from './lib/nextAuthOptions'
import * as Sentry from "@sentry/nextjs";
import { TokenRepository } from './lib/typescirpt-node-oauth-server/repositories'

export async function createContext({
    req,
    resHeaders,
}: FetchCreateContextFnOptions) {
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers

    // This is just an example of something you might want to do in your ctx fn

    async function getUserId(): Promise<string | undefined> {
        let userId = undefined
        if (req.headers.has('authorization')) {
            if(req.headers.has('backgroundprocess')) {
                const repo = new TokenRepository()
                const token = req.headers.get('authorization')
                Sentry.captureMessage("authorization token: " + (token ?? ""));
                if (token) {
                    try {
                        console.error("background login a", req.url)
                        const user = await repo.getByRefreshToken(token)
                        console.error("background login b", user.refreshTokenExpiresAt.getTime())
                        if(user.refreshTokenExpiresAt && user.refreshTokenExpiresAt.getTime() >= (new Date()).getTime()) {
                            console.error("background login", req.url)
                            userId = user.user?.id;
                        }
                    } catch (e) {
                        //console.error('Error verifying jwt', e)
                        Sentry.captureMessage("verifying token failed: " + e);
                    }
                }
            }
            else {
                const token = req.headers.get('authorization')
                Sentry.captureMessage("authorization token: " + (token ?? ""));
                if (token) {
                    try {
                        console.error("foreground login", req.url)
                        userId = (await jwtService.verify(token)).sub
                    } catch (e) {
                        //console.error('Error verifying jwt', e)
                        Sentry.captureMessage("verifying token failed: " + e);
                    }
                }
            }
        } else {
            const session = await getServerSession(authOptions())
            if (session && session.user.id) {
                userId = session.user.id
            }
        }
        return userId
    }
    const userId = await getUserId()

    return { req, resHeaders, userId }
}
export type Context = Awaited<ReturnType<typeof createContext>>

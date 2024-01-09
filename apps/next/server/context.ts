import { FetchCreateContextFnOptions } from '@trpc/server/dist/adapters/fetch'
import { jwtService } from './lib/typescirpt-node-oauth-server'
//@ts-ignore
import { getServerSession } from 'next-auth'
import { authOptions } from './lib/nextAuthOptions'

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
            const token = req.headers.get('authorization')
            if (token) {
                try {
                    userId = (await jwtService.verify(token)).sub
                } catch (e) {
                    console.error('Error verifying jwt', e)
                }
            }
        } else {
            const session = await getServerSession(authOptions)
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

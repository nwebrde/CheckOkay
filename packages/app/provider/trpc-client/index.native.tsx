import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useState } from 'react'
import type { AppRouter } from 'next-app/server/routers/_app'
import { useAuth } from 'app/provider/auth-context/index.native'
import { jwtDecode } from 'jwt-decode'
import superjson from 'superjson';


//polyfill needed for jwtDecode
import atob from 'core-js-pure/stable/atob'
import btoa from 'core-js-pure/stable/btoa'
import { tokenRefreshLink } from 'app/provider/trpc-client/refreshLink'
import { localAccessToken } from 'app/provider/auth-context/state.native'

global.atob = atob
global.btoa = btoa

export const trpc = createTRPCReact<AppRouter>({
    overrides: {
        useMutation: {
            async onSuccess(opts) {
                await opts.originalFn()
                await opts.queryClient.invalidateQueries()
            },
        },
    },
})

function getBaseUrl() {
    if (typeof window !== 'undefined')
        // browser should use relative path
        return ''
    if (process.env.VERCEL_URL)
        // reference for vercel.com
        return `https://${process.env.VERCEL_URL}`
    if (process.env.RENDER_INTERNAL_HOSTNAME)
        // reference for render.com
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`
}

export function TRPCProvider(props: { children: React.ReactNode }) {
    const { refresh, signOut } = useAuth()!
    const trpcClient = trpc.createClient({
        links: [
            loggerLink({
                enabled: () => false,
            }),

            tokenRefreshLink({
                // access to the original tRPC query operation object
                // is accessible on both methods
                tokenRefreshNeeded: (query) => {
                    // on every request, this function is called
                    if (!localAccessToken) {
                        return true
                    }

                    let decodedToken
                    try {
                        decodedToken = jwtDecode(localAccessToken!)
                    } catch {
                        signOut()
                    }

                    if (!decodedToken) {
                        return true
                    }

                    // if access token expires in the next 10 sec
                    if (decodedToken.exp! - Date.now() / 1000 <= 5) {
                        return true
                    }

                    // Return `false` as default statement
                    return false
                },
                fetchAccessToken: async (query) => {
                    // if true is returned from tokenRefreshNeeded, this function will be called
                    // do your magic to fetch a refresh token here
                    // example:
                    try {
                        const result = await refresh()
                        if (!result) {
                            await signOut()
                        }
                    } catch (err) {
                        // token refreshing failed, let's log the user out
                        await signOut()
                    }
                },
            }),

            httpBatchLink({
                url: 'http://localhost:3000/api/trpc',
                headers: () => {
                    return {authorization: localAccessToken!}
                }
            }),
        ],
        transformer: superjson
    })

    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 3,
                    },
                    mutations: {
                        retry: 3,
                    },
                },
            }),
    )

    return (
        // @ts-ignore
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}

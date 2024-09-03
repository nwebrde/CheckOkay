import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useState } from 'react'
import type { AppRouter } from 'next-app/server/routers/_app'
import { jwtDecode } from 'jwt-decode'
import superjson from 'superjson';


//polyfill needed for jwtDecode
import atob from 'core-js-pure/stable/atob'
import btoa from 'core-js-pure/stable/btoa'
import { tokenRefreshLink } from 'app/provider/trpc-client/refreshLink'
import { getAccessToken, getRefreshToken, refresh, signOut } from 'expo-app/lib/OAuthClient'

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
    return process.env.EXPO_PUBLIC_API_URL
}

export function TRPCProvider(props: { children: React.ReactNode }) {
    const trpcClient = trpc.createClient({
        links: [
            loggerLink({
                enabled: () => false
            }),

            tokenRefreshLink({
                // access to the original tRPC query operation object
                // is accessible on both methods
                tokenRefreshNeeded: async (query) => {
                    const accessToken = await getAccessToken()
                    const refreshToken = await getRefreshToken()

                    // on every request, this function is called
                    if (!accessToken || !refreshToken) {
                        return true
                    }

                    let decodedToken
                    try {
                        decodedToken = jwtDecode(accessToken)
                    } catch (e) {
                        await signOut()
                    }

                    if (!decodedToken || !decodedToken.exp) {
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
                url: process.env.EXPO_PUBLIC_API_URL!,
                headers: async () => {
                    const token = await getAccessToken()
                    return {authorization: token!}
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
                        retry: 0,
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

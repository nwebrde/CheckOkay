import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { useEffect, useState } from 'react'
import type { AppRouter } from 'next-app/server/routers/_app'
import { jwtDecode } from 'jwt-decode'
import superjson from 'superjson';


//polyfill needed for jwtDecode
import atob from 'core-js-pure/stable/atob'
import btoa from 'core-js-pure/stable/btoa'
import { tokenRefreshLink } from 'app/provider/trpc-client/refreshLink'
import { getAccessToken, getRefreshToken, refresh, signOut } from 'expo-app/lib/OAuthClient'
import { AppState } from 'react-native'

global.atob = atob
global.btoa = btoa

export const trpc = createTRPCReact<AppRouter>({
    overrides: {
        useMutation: {
            async onSuccess(opts) {
                await opts.originalFn()
                await opts.queryClient.invalidateQueries()
            },
        }
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
    const createTrpcClient = (appState) => trpc.createClient({
        links: [
            loggerLink({
                enabled: () => false
            }),

            tokenRefreshLink({
                // access to the original tRPC query operation object
                // is accessible on both methods
                tokenRefreshNeeded: async (query) => {

                    if(appState != "active") {
                        return false
                    }

                    const accessToken = await getAccessToken()
                    const refreshToken = await getRefreshToken()

                    // on every request, this function is called
                    if (!accessToken) {
                        await signOut()
                        return false
                    }

                    let decodedToken
                    try {
                        decodedToken = jwtDecode(accessToken)
                    } catch (e) {
                        await signOut()
                        return false
                    }

                    if (!decodedToken || !decodedToken.exp) {
                        await signOut()
                        return false
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
                        await refresh()
                    } catch (err) {
                        // token refreshing failed
                    }
                },
            }),

            httpBatchLink({
                url: process.env.EXPO_PUBLIC_API_URL!,
                headers: async () => {
                    if(appState != "active") {
                        return {
                            authorization: (await getRefreshToken())!,
                            backgroundprocess: "true"
                        }
                    }
                    return {authorization: (await getAccessToken())!}
                },

            }),
        ],
        transformer: superjson
    })

    const [trpcClient, setTrpcClient] = useState(createTrpcClient(AppState.currentState))

    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) => {
                        // @ts-ignore
                        if (error instanceof TRPCClientError && error.data?.code === 'UNAUTHORIZED') {
                            signOut();
                        }
                    },
                }),
                mutationCache: new MutationCache({
                    onError: (error) => {
                        if (error instanceof TRPCClientError && error.data?.code === 'UNAUTHORIZED') {
                            signOut();
                        }
                    },
                }),
                defaultOptions: {
                    queries: {
                        retry: 3
                    },
                    mutations: {
                        retry: 0
                    },
                },
            }),
    )

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => setTrpcClient(createTrpcClient(state)));

        return () => {
            subscription.remove();
        }
    }, []);

    return (
        // @ts-ignore
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}

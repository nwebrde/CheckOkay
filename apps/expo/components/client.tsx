"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {httpBatchLink, loggerLink} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import {useEffect, useState} from "react";
import {useAuth} from "./AuthContext";
import {refreshTokenLink} from "@pyncz/trpc-refresh-token-link";
import type {AppRouter} from "next-app/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>({});

function getBaseUrl() {
    if (typeof window !== "undefined")
        // browser should use relative path
        return "";
    if (process.env.VERCEL_URL)
        // reference for vercel.com
        return `https://${process.env.VERCEL_URL}`;
    if (process.env.RENDER_INTERNAL_HOSTNAME)
        // reference for render.com
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function ClientProvider(props: { children: React.ReactNode }) {
    const { accessToken, refresh, refreshToken, signOut } = useAuth()!;
    let localAccessToken = accessToken

    const createClient = () => trpc.createClient({
            links: [

                loggerLink({
                    enabled: () => false,
                }),

                refreshTokenLink({
                    // Get locally stored refresh token
                    getRefreshToken: () => {
                        return !refreshToken ? undefined : refreshToken
                    },

                    // Fetch a new JWT pair by refresh token from your API
                    fetchJwtPairByRefreshToken: async (refreshT) => {
                        const result = await refresh();
                        localAccessToken = result?.accessToken!
                        return {access: result?.accessToken!, refresh: result?.refreshToken!};
                    },

                    // Callback on JWT pair is successfully fetched with `fetchJwtPairByRefreshToken`
                    onJwtPairFetched: (payload) => {},

                    // optional: Callback on JWT refresh request is failed
                    onRefreshFailed: async () => {
                        await signOut()
                    },

                    // optional: Callback on a request is failed with UNAUTHORIZED code,
                    // before the refresh flow is started
                    onUnauthorized: () => {},
                }),

                httpBatchLink({
                    url: `http://localhost:3000/api/trpc`,
                    async headers() {
                        return {
                            authorization: localAccessToken!,
                        };
                    },
                }),
            ],
        })
    const [trpcClient, setClient] = useState(createClient);

    // update trpcClient if accessToken or refreshToken updates
    useEffect(() => {
        localAccessToken = accessToken
        setClient(createClient)
    }, [accessToken, refreshToken])

    const [queryClient] = useState(() => new QueryClient());

    return (
        // @ts-ignore
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    );
}
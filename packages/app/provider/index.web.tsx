'use client'

import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context'
import { TRPCProvider } from 'app/provider/trpc-client'
import { SessionProvider } from 'next-auth/react'

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SafeArea>
            <SessionProvider>
                <AuthProvider>
                    <TRPCProvider>{children}</TRPCProvider>
                </AuthProvider>
            </SessionProvider>
        </SafeArea>
    )
}

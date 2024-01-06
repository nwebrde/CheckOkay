'use client'

import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context'
import { TRPCProvider } from 'app/provider/trpc-client'
import { SessionProvider } from 'next-auth/react'
import { localMoment } from 'app/lib/time'

export function Provider({ children }: { children: React.ReactNode }) {
    localMoment.locale('de')
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

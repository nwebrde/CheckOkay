'use client'

import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context'
import { TRPCProvider } from 'app/provider/trpc-client'
import { SessionProvider } from 'next-auth/react'
import { localMoment } from 'app/lib/time'
import { NotificationsProvider } from 'app/provider/notifications'

export function Provider({ children }: { children: React.ReactNode }) {
    localMoment.locale('de')
    return (
        <SafeArea>
            <SessionProvider>
                <AuthProvider>
                    <TRPCProvider>
                        <NotificationsProvider>
                        {children}
                        </NotificationsProvider></TRPCProvider>
                </AuthProvider>
            </SessionProvider>
        </SafeArea>
    )
}

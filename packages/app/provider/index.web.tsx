'use client'

import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context'
import { TRPCProvider } from 'app/provider/trpc-client'
import { SessionProvider } from 'next-auth/react'
import { localMoment } from 'app/lib/time'
import { NotificationsProvider } from 'app/provider/notifications'
import { Toaster } from "burnt/web";
import { PortalHost } from '@rn-primitives/portal';
import React from 'react'
import { NavigationProvider } from 'app/provider/navigation'

export function Provider({ children }: { children: React.ReactNode }) {
    localMoment.locale('de')
    return (
        <SafeArea>
            <NavigationProvider>
            <SessionProvider>
                <AuthProvider>
                    <TRPCProvider>
                        <NotificationsProvider>
                        {children}
                            <Toaster position='bottom-right' />
                            <PortalHost />
                        </NotificationsProvider></TRPCProvider>
                </AuthProvider>
            </SessionProvider>
            </NavigationProvider>
        </SafeArea>
    )
}

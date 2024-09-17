import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context/index.native'
import { TRPCProvider } from 'app/provider/trpc-client/index.native'
import { localMoment } from 'app/lib/time'
import { NotificationsProvider } from 'app/provider/notifications'
import { PortalHost } from '@rn-primitives/portal';
import React from 'react'
import { ToastProvider } from 'react-native-toast-notifications'
import Toast from 'react-native-toast-message';
import { StepProvider } from 'app/provider/steps'


export function Provider({ children }: { children: React.ReactNode }) {
    localMoment.locale('de')
    return (
        <SafeArea>

            <AuthProvider>
                <TRPCProvider>
                    <StepProvider>
<NotificationsProvider>
    <ToastProvider>
                    {children}
    </ToastProvider>
    <Toast />
    <PortalHost />
</NotificationsProvider>
                    </StepProvider>
                    </TRPCProvider>
            </AuthProvider>
        </SafeArea>
    )
}

import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context/index.native'
import { TRPCProvider } from 'app/provider/trpc-client/index.native'
import { localMoment } from 'app/lib/time'
import { NotificationsProvider } from 'app/provider/notifications'

export function Provider({ children }: { children: React.ReactNode }) {
    localMoment.locale('de')
    return (
        <SafeArea>
            <AuthProvider>
                <TRPCProvider>
<NotificationsProvider>
                    {children}
</NotificationsProvider>
                    </TRPCProvider>
            </AuthProvider>
        </SafeArea>
    )
}

import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context/index.native'
import { TRPCProvider } from 'app/provider/trpc-client/index.native'
import { localMoment } from 'app/lib/time'

export function Provider({ children }: { children: React.ReactNode }) {
    localMoment.locale('de')
    return (
        <SafeArea>
            <AuthProvider>
                <TRPCProvider>{children}</TRPCProvider>
            </AuthProvider>
        </SafeArea>
    )
}

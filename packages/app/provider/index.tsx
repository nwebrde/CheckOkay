import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context/index.native'
import { TRPCProvider } from 'app/provider/trpc-client/index.native'

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SafeArea>
            <AuthProvider>
                <TRPCProvider>{children}</TRPCProvider>
            </AuthProvider>
        </SafeArea>
    )
}

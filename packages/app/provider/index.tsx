import { SafeArea } from './safe-area'
import { AuthProvider } from 'app/provider/auth-context'
import { TRPCProvider } from 'app/provider/trpc-client'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <SafeArea>
      <AuthProvider>
        <TRPCProvider>{children}</TRPCProvider>
      </AuthProvider>
    </SafeArea>
  )
}

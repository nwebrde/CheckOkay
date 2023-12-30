import { H1, P } from 'app/design/typography'
import { View } from 'app/design/view'

import { useAuth } from 'app/provider/auth-context'
import { ActivityIndicator } from 'react-native'
import { Button } from 'app/design/button'

import { Logo } from 'app/design/logo'

export function SignInScreen() {
    const { signIn, isLoading } = useAuth()!

    if (isLoading) {
        return <ActivityIndicator />
    }

    return (
        <View className="bg-secondary flex-1 items-center justify-center p-3">
            <Logo doAnimate={true} />
            <View className="max-w-xl">
                <H1 className="mb-0 text-center text-lg">
                    Hallo, Fremder! {'\n'}Sag uns doch wer du bist.
                </H1>
                <P className="mt-3 text-center text-lg">
                    Du musst dich anmelden um die App zu nutzen. Melde dich bei
                    einem bestehenden Konto an oder registriere dich.
                </P>
            </View>
            <Button text="Anmelden" onClick={signIn} />
        </View>
    )
}

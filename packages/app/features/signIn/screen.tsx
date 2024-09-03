import { P, Text } from 'app/design/typography'
import { View } from 'app/design/view'

import { ActivityIndicator } from 'react-native'
import { Button } from 'app/design/button'

import { Logo } from 'app/design/logo'
import { useEffect, useState } from 'react'
import { getRefreshToken, signIn } from 'expo-app/lib/OAuthClient'

export function SignInScreen() {
    const [needLogin, setNeedLogin] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        getRefreshToken().then(token => {
            setNeedLogin(!token);
        }).catch((e) => {
            setNeedLogin(true)
        });
    }, []);

    if (needLogin == undefined) {
        return <ActivityIndicator />
    }

    return (
        <View className="bg-secondary flex-1 items-center justify-center p-3">
            <Logo doAnimate={true} />
            <View className="max-w-xl">
                <Text type="H1" className="mb-0 text-center text-lg">
                    Hallo, Fremder! {'\n'}Sag uns doch wer du bist.
                </Text>
                <P className="mt-3 text-center text-lg">
                    Du musst dich anmelden um die App zu nutzen. Melde dich bei
                    einem bestehenden Konto an oder registriere dich.
                </P>
            </View>
            <Button text="Anmelden" onClick={signIn} />
        </View>
    )
}

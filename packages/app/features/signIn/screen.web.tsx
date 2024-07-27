import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Logo } from 'app/design/logo'
import { View } from 'app/design/view'
import { P, Text } from 'app/design/typography'
import { ClientSafeProvider, getProviders, LiteralUnion } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { BuiltInProviderType } from 'next-auth/providers'
import { useRouter } from 'solito/navigation'

export function SignInScreen() {
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
    const router = useRouter()
    useEffect(() => {
        async function fetchData() {
            try {
                const providers = await getProviders()
                setProviders(providers);
            } catch (e) {
            }
        };
        fetchData();
    }, []);

    return (
        <>
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
                    <SettingsGroup>
                        {(providers?.apple) &&
                            <SettingsRow label={"Sign in with Apple"} link={providers.apple.signinUrl} useRelative={false} />
                        }
                        {(providers?.discord) &&
                            <SettingsRow label={"Sign in with Discord"} link={providers.discord.signinUrl} useRelative={false} />
                        }
                    </SettingsGroup>
                </View>
            </View>

        </>
    )
}
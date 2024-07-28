import { Logo } from 'app/design/logo'
import { View } from 'app/design/view'
import { P, Text } from 'app/design/typography'
import { signIn } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'solito/navigation'
import { GoogleLoginButton, AppleLoginButton, DiscordLoginButton } from "react-social-login-buttons";
import { Apple, Google } from 'next-app/components/icons/socials'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import * as Burnt from 'burnt'


export function SignInScreen() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = (searchParams?.get('callbackUrl')) ?? undefined

    useEffect(() => {
        if(searchParams?.has("error")) {
            Burnt.toast({
                title: "Fehler", // required

                preset: "error", // or "error", "none", "custom"

                message: "Anmeldung nicht erfolgreich, versuche es erneut", // optional

                haptic: "error", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });
        }
    }, [])

    return (
        <>
            <View className="bg-secondary flex-1 items-center justify-center p-3">
                <Logo doAnimate={true} />
                <View className="max-w-xl items-center">
                    <Text type="H1" className="mb-0 text-center text-lg">
                        Hallo, Fremder! {'\n'}Sag uns wer du bist.
                    </Text>
                    <P className="mt-3 text-center text-lg">
                        Du musst dich anmelden um die App zu nutzen. {'\n'}Melde dich über einen der folgenden Anbieter an:
                    </P>

                    <View className="flex flex-col mt-2">
                        <GoogleLoginButton text="Melde dich mit Google an" style={{borderRadius: 10, boxShadow: "none", borderColor: "#c9ba97", border: "1.5px solid"}} onClick={() => signIn("google", { callbackUrl: callbackUrl })} />
                        <AppleLoginButton text="Melde dich mit Apple an" style={{borderRadius: 10, boxShadow: "none", borderColor: "#000", border: "1.5px solid"}} onClick={() => signIn("apple", { callbackUrl: callbackUrl })} />
                        <DiscordLoginButton text="Melde dich mit Discord an" style={{borderRadius: 10, boxShadow: "none"}} onClick={() => signIn("discord", { callbackUrl: callbackUrl })} />
                    </View>






                    {
                        /*

                         <View className="w-96">
                        <SettingsGroup>
                            <SettingsRow label="Melde dich mit Apple an" headerChild={<Apple />} onPress={() => signIn("apple", { callbackUrl: callbackUrl })} />
                            <SettingsRow label="Melde dich mit Google an" headerChild={<Google />} separator={false} onPress={() => signIn("google", { callbackUrl: callbackUrl })} />
                        </SettingsGroup>
                    </View>


                         */
                    }


                </View>
            </View>

        </>
    )
}
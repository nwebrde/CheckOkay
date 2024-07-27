import { Logo } from 'app/design/logo'
import { View } from 'app/design/view'
import { P, Text } from 'app/design/typography'
import { signIn } from 'next-auth/react'
import React from 'react'
import { useRouter, useSearchParams } from 'solito/navigation'
import { GoogleLoginButton, AppleLoginButton } from "react-social-login-buttons";


export function SignInScreen() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = (searchParams?.get('callbackUrl')) ?? undefined

    return (
        <>
            <View className="bg-secondary flex-1 items-center justify-center p-3">
                <Logo doAnimate={true} />
                <View className="max-w-xl">
                    <Text type="H1" className="mb-0 text-center text-lg">
                        Hallo, Fremder! {'\n'}Sag uns doch wer du bist.
                    </Text>
                    <P className="mt-3 text-center text-lg">
                        Du musst dich anmelden um die App zu nutzen. Melde dich über dein Google oder Apple Konto an.
                    </P>

                    <View className="flex flex-row gap-3 mt-10">
                        <GoogleLoginButton text="Melde dich mit Google an" style={{borderRadius: 10, boxShadow: "none", borderColor: "#c9ba97", border: "1px solid"}} onClick={() => signIn("google", { callbackUrl: callbackUrl })} />
                        <AppleLoginButton text="Melde dich mit Apple an" style={{borderRadius: 10, boxShadow: "none", borderColor: "#c9ba97", border: "1px solid"}} onClick={() => signIn("apple", { callbackUrl: callbackUrl })} />
                    </View>

                </View>
            </View>

        </>
    )
}
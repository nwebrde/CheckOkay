'use client'

import { HomeScreen as Screen } from 'app/features/home/screen'
import { useAuth } from 'app/provider/auth-context'
import { ActivityIndicator } from 'react-native'
import { SignInScreen } from 'app/features/signIn/screen'
import { View } from 'app/design/view'

export default function HomeScreen() {

    const { user, isLoading, signIn } = useAuth()!
    if (isLoading) {
        return (
            <View className="w-screen h-screen items-center justify-center">
                <ActivityIndicator />
            </View>
        )
    }


    return <Screen />
}

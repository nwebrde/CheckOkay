'use client'

import { HomeScreen as Screen } from 'app/features/home/screen'
import { useAuth } from 'app/provider/auth-context'
import { ActivityIndicator } from 'react-native'
import { SignInScreen } from 'app/features/signIn/screen'

export default function HomeScreen() {
    const { user, isLoading, signIn } = useAuth()!
    if (isLoading) {
        return <ActivityIndicator />
    } else if (!user) {
        return <SignInScreen />
    }
    return <Screen />
}

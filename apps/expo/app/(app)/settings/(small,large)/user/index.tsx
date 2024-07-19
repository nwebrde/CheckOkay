import { Stack } from 'expo-router'
import React from 'react'
import { PublicProfileScreen } from 'app/features/settings/user/PublicProfileScreen'

export default function Page() {
    return (
        <>
            <Stack.Screen options={{headerTitle: "Öffentliches Profil"}} />
            <PublicProfileScreen />
        </>
    )
}
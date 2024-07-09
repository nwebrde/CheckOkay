import { Dimensions } from 'react-native'
import { Redirect, Stack } from 'expo-router'
import React from 'react'
import { SettingsScreen } from 'app/features/settings/index/SettingsScreen'

export default function Page() {
    if (Dimensions.get('window').width >= 750) {
        return <Redirect href="/settings/(large)/channels" />
    }
    return (
        <>
            <SettingsScreen />
            <Stack.Screen
                options={{ headerTitle: 'Einstellungen', headerLargeTitle: true }} />
        </>
    )
}

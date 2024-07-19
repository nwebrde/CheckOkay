import { Stack } from 'expo-router'
import React from 'react'
import { ChecksScreen } from 'app/features/settings/checks/ChecksScreen'

export default function Page() {
    return (
        <>
            <Stack.Screen options={{headerTitle: "Kontrollzeitpunkte"}} />
            <ChecksScreen />
        </>
        )
}
import { Stack } from 'expo-router'
import React from 'react'
import { GuardsScreen } from 'app/features/settings/guards/GuardsScreen'

export default function Page() {
    return (
        <>
            <Stack.Screen options={{headerTitle: "Deine Beschützer"}} />
            <GuardsScreen />
        </>
        )
}
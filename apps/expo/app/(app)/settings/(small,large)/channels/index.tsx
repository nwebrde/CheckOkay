import { Stack } from 'expo-router'
import React from 'react'
import { Notifications } from 'app/features/settings/notifications/notifications'

export default function Page() {
    return (
        <>
            <Stack.Screen options={{headerTitle: "Erhalte Benachrichtigungen über"}} />
            <Notifications />
        </>
        )
}
import { Stack } from 'expo-router'
import React from 'react'
import { Notifications } from 'app/features/settings/notifications/notifications'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

const PageWrapped = gestureHandlerRootHOC(Notifications)

export default function Page() {
    return (
        <>
            <Stack.Screen options={{headerTitle: "Erhalte Benachrichtigungen über"}} />
            <PageWrapped />
        </>
    )
}
import { Redirect, Stack } from 'expo-router'
import { Text } from 'react-native'
import { useAuth } from 'app/provider/auth-context/index.native'
import React from 'react'


export default function AppLayout() {
    const { refreshToken, isLoading } = useAuth()!

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return <Text>Loading...</Text>
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!refreshToken || refreshToken === '') {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return <Redirect href="/sign-in" />
    }

    // This layout can be deferred because it's not the root layout.
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#F1EDE1',
                },
                headerTitleAlign: "center",
                headerTintColor: '#2F5651',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTransparent: false,
                contentStyle: {
                    backgroundColor: "#ffffff"
                },
            }}
        >
            <Stack.Screen name="settings/(small)/channels/addMail" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
            <Stack.Screen name="settings/(small)/reminder_delay/setReminder" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
        </Stack>
    )
}

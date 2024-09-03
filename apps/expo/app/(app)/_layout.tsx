import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { View } from 'app/design/view'
import { getRefreshToken } from '../../lib/OAuthClient'


export default function AppLayout() {
    const [needLogin, setNeedLogin] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        getRefreshToken().then(token => {
            setNeedLogin(!token);
        }).catch((e) => {
            setNeedLogin(true)
        });
    }, []);

    // You can keep the splash screen open, or render a loading screen like we do here.
    if (needLogin == undefined) {
        return <View className="w-screen h-screen items-center justify-center">
            <ActivityIndicator />
        </View>
    }

    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (needLogin) {
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
                }
            }}
        >
            <Stack.Screen name="index" options={{gestureEnabled: false}} />
            <Stack.Screen name="settings/(small)/user/deleteUser" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
            <Stack.Screen name="settings/(small)/channels/addMail" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
            <Stack.Screen name="settings/(small)/reminder_delay/setReminder" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
            <Stack.Screen name="settings/(small)/reminder_delay/setDelay" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
            <Stack.Screen name="settings/(small)/checks/addCheck" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
            <Stack.Screen name="settings/(small)/guards/invite" options={{presentation: "modal", headerTitleAlign: "center", animation: "slide_from_bottom", animationDuration: 100, gestureEnabled: true}} />
        </Stack>
    )
}

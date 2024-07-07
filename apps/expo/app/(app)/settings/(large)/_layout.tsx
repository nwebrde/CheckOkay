import { Stack, usePathname } from 'expo-router'
import React from 'react'
import { View } from 'app/design/view'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import { Button } from 'app/design/button'
import { SettingsNavigatorLayout } from 'app/features/settings/index/SettingsNavigatorLayout'


export default function SettingsLayout() {

    const pathname = usePathname()

    return (
        <>
            <Stack.Screen options={{headerShown: false}} />
            <SettingsNavigatorLayout currentPath={pathname} >
                <View className="flex-1 border-2 border-secondary overflow-hidden rounded-xl">
                    <Stack
                        screenOptions={{
                            headerLargeTitle: false,
                            headerTintColor: '#2F5651',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                            headerTransparent: false,
                            contentStyle: {
                                backgroundColor: "#ffffff"
                            },
                            headerBackVisible: false
                        }}
                    >
                        <Stack.Screen name="channels/addMail" options={{presentation: "modal", headerShown:true, animation: "slide_from_bottom",
                            animationDuration: 100, gestureEnabled: true}} />
                        <Stack.Screen name="reminder_delay/setReminder" options={{presentation: "modal", headerShown:true, animation: "slide_from_bottom",
                            animationDuration: 100, gestureEnabled: true}} />
                    </Stack>
                </View>
            </SettingsNavigatorLayout>
        </>
    );
}

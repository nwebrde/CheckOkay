'use client';

import { View } from 'app/design/view'
import React, { useRef } from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import { usePathname } from 'next/navigation'
import { SettingsNavigatorLayout } from 'app/features/settings/index/SettingsNavigatorLayout'
import { Dimensions } from 'react-native'
import { Redirect } from 'expo-router'



export default function SettingsLayout({
    children,
    modals
}: {
    children: React.ReactNode,
    modals: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <>


            <View className="hidden lg:block w-full h-screen">
                <SettingsNavigatorLayout currentPath={pathname}>
                    <View className="flex-1 rounded-xl bg-white h-full">
                        {children}
                    </View>
                </SettingsNavigatorLayout>
            </View>
            <View className="block lg:hidden w-full h-full">
                {children}
            </View>



                {modals}

        </>
    )
}

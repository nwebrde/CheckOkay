'use client';

import { View } from 'app/design/view'
import React from 'react'
import { usePathname } from 'next/navigation'
import { SettingsNavigatorLayout } from 'app/features/settings/index/SettingsNavigatorLayout'
import { ActivityIndicator, Dimensions } from 'react-native'
import { useLargeSettings } from '../../../hooks/windowDimensions'



export default function SettingsLayout({
    children,
    modals
}: {
    children: React.ReactNode,
    modals: React.ReactNode
}) {
    const pathname = usePathname()
    const useLarge = useLargeSettings()

    return (
        <>


            {(useLarge) &&
            <View className="w-full h-screen">
                <SettingsNavigatorLayout currentPath={pathname}>
                    <View className="flex-1 rounded-xl bg-white h-full overflow-scroll">
                        {children}
                    </View>
                </SettingsNavigatorLayout>
            </View>
            }

            {(useLarge !== undefined && !useLarge) &&
                children
            }

            {(useLarge === undefined) &&
                <View className="w-screen h-screen items-center justify-center">
                    <ActivityIndicator />
                </View>
            }



                {modals}

        </>
    )
}

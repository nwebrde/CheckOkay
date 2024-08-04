'use client'
import React, { ReactElement } from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import Screen from 'app/design/screen'
import { View } from 'app/design/view'

/**
 * Only shown on small devices.
 * On large devices, the SettingsNavigator is used for navigation and displayed as an sidebar
 * (see nextjs and expo layouts)
 * @constructor
 */
export function SettingsNavigatorLayout({children, currentPath}: {children: ReactElement, currentPath: string}) {

    return (
        <View className="flex-1 flex-row bg-secondary p-8 h-screen items-center">
            <View className="pr-8 overflow-scroll max-h-full">
                <SettingsNavigator header={true} currentPath={currentPath} useRelative={false} />
            </View>
            {children}
        </View>
    )
}

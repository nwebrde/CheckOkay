'use client'
import React, { ReactElement } from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import { Screen } from 'app/design/layout'
import { View } from 'app/design/view'

/**
 * Only shown on small devices.
 * On large devices, the SettingsNavigator is used for navigation and displayed as an sidebar
 * (see nextjs and expo layouts)
 * @constructor
 */
export function SettingsNavigatorLayout({children, currentPath}: {children: ReactElement, currentPath: string}) {

    return (
        <View className="flex-1 flex-row content-center items-center bg-secondary p-8 h-full">
            <View className="pr-8">
                <SettingsNavigator header={true} currentPath={currentPath} />
            </View>
            {children}
        </View>
    )
}

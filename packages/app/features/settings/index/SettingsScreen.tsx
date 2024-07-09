'use client'
import React from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import { Screen } from 'app/design/layout'
import { Button } from 'app/design/button'
import { useAuth } from 'app/provider/auth-context'

/**
 * Only shown on small devices.
 * On large devices, the SettingsNavigator is used for navigation and displayed as an sidebar
 * (see nextjs and expo layouts)
 * @constructor
 */
export function SettingsScreen() {
    const auth = useAuth()
    return (
        <Screen width="max-w-xl">
            <SettingsNavigator header={false} currentPath="" useRelative />
            <Button text="Abmelden" onClick={auth?.signOut}/>
        </Screen>
    )


    /*
    return (
        <>
        <Screen width="max-w-2xl">
            <SettingsGroup>
                <SettingsRow label="Check-In Zeitpunkte" navigational separator={false} />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsRow label="Deine Beschützer" navigational separator={false} />
            </SettingsGroup>
            <SettingsGroup title="Benachrichtigungen">
                <SettingsRow label="Erinnerungen und zeitverzögerte Warnungen" navigational />
                <SettingsRow label="Erhalte Benachrichtigungen über" navigational separator={false} />
            </SettingsGroup>
        </Screen>
        </>
    )

     */
    /*
    return (
        <Screen width="max-w-2xl">
            <View className="w-full">
                <Text type="H1">Kontrollzeitpunkte</Text>
                <ChecksList />
                <VSpacer />
                <Guards />
                <VSpacer />
                <Text type="H1">Weitere Einstellungen</Text>
                <CheckSettings />
                <Notifications />
            </View>
        </Screen>
    )

     */
}

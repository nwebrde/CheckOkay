'use client'
import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'

import ChecksList from 'app/features/settings/checks/ChecksList'
import { CheckSettings } from 'app/features/settings/checkSettings/CheckSettings'
import { Screen, VSpacer } from 'app/design/layout'
import GuardsList from 'app/features/settings/guards/GuardsList'
import { Guards } from 'app/features/settings/guards/Guards'

export function SettingsScreen() {
    return (
        <Screen width="max-w-2xl">
            <View className="w-full">
                <H1>Kontrollzeitpunkte</H1>
                <ChecksList />
                <VSpacer />
                <Guards />
                <VSpacer />
                <H1>Weitere Einstellungen</H1>
                <CheckSettings />
            </View>
        </Screen>
    )
}

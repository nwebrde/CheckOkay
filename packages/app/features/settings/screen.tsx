'use client'
import { H1} from 'app/design/typography'
import { View } from 'app/design/view'

import ChecksList from 'app/features/settings/checks/ChecksList'
import { CheckSettings } from 'app/features/settings/checkSettings/CheckSettings'
import { Screen, VSpacer } from 'app/design/layout'
import { Guards } from 'app/features/settings/guards/Guards'
import { Notifications } from 'app/features/settings/notifications/notifications'
import EmailList from 'app/features/settings/notifications/emailList'

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
                <Notifications />
            </View>
        </Screen>
    )
}

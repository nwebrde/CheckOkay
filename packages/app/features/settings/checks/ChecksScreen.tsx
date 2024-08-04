import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import Screen from 'app/design/screen'
import { SettingsRow } from 'app/design/settings/row'
import { HeaderLink } from 'app/design/settings/HeaderLink'
import { SettingsGroup } from 'app/design/settings/group'
import React from 'react'
import ChecksList from 'app/features/settings/checks/ChecksList'

function ChecksScreenn() {
    return(
        <Screen width="max-w-xl">
            <SettingsGroup>
                <SettingsRow headerChild={<HeaderLink href="addCheck" />} separator={false} label="Kontrollzeitpunkte" description="Konfiguriere die Zeitpunkte zu denen du dich in der App zurückmelden musst">
                    <ChecksList />
                </SettingsRow>
            </SettingsGroup>
        </Screen>
    )
}

export const ChecksScreen = gestureHandlerRootHOC(ChecksScreenn)
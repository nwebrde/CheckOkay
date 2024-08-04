import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import EmailsList from 'app/features/settings/notifications/emailsList'
import { Button } from 'app/design/button'
import Link from 'next/link'
import { Text } from 'app/design/typography'
import React from 'react'
import { Switch } from 'react-native'
import Screen from 'app/design/screen'
import { HeaderLink } from 'app/design/settings/HeaderLink'

export function Notifications() {
    return (
        <Screen width="max-w-xl">
            <SettingsGroup>
                <SettingsRow headerChild={<HeaderLink href="addMail" />} separator={false} label="Zusätzliche Emails für Warnungen" description="Erhalte Warnungen über den Zustand deiner Freunde über folgende weitere Email Adressen" fullsize={true}>
                    <EmailsList />
                </SettingsRow>
            </SettingsGroup>
        </Screen>
    )
}


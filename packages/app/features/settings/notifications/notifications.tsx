import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import EmailsList from 'app/features/settings/notifications/emailsList'
import React, { useEffect, useState } from 'react'
import { Switch } from 'react-native'
import Screen from 'app/design/screen'
import { HeaderLink } from 'app/design/settings/HeaderLink'
import { trpc } from 'app/provider/trpc-client'
import { PushNotifications } from 'app/features/settings/notifications/pushSettings/pushNotifications'

export function Notifications() {
    const user = trpc.getUser.useQuery()
    const emailNotificationMutation = trpc.user.setEmailNotifications.useMutation()

    const [emailState, setEmailState] = useState(false)

    const toggleEmail = async () => {
        if (emailState) {
            // deregister
            emailNotificationMutation.mutate({
                state: false,
            })
            setEmailState(false)
        } else {
            emailNotificationMutation.mutate({
                state: true,
            })
            setEmailState(true)
        }
    }

    useEffect(() => {
        if(user.data) {
            setEmailState(user.data.notificationsByEmail)
        }
    }, [user, user.data])

    return (
        <Screen width="max-w-xl">
            <PushNotifications />
            <SettingsGroup>
                <SettingsRow headerChild={<Switch
                    onValueChange={toggleEmail}
                    value={emailState}
                />} separator={true} label="Email Benachrichtigungen" description="Aktiviere Benachrichtigungen an deine Profil Email Adresse für Warnungen, kritische Erinnerungen an deinen Rückmeldezeitpunkt und für neue Beschützer. " />
                <SettingsRow headerChild={<HeaderLink href="addMail" />} separator={false} label="Zusätzliche Emails für Warnungen" description="Erhalte Warnungen über den Zustand deiner Freunde über folgende weitere Email Adressen" fullsize={true}>
                    <EmailsList />
                </SettingsRow>
            </SettingsGroup>
        </Screen>
    )
}


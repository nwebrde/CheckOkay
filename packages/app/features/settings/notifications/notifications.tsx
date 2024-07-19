import { Button, StyledLink } from 'app/design/button'
import { useNotifications } from 'app/provider/notifications'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Switch } from 'react-native'
import { trpc } from 'app/provider/trpc-client'
import React, { useEffect, useState } from 'react'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import EmailsList from 'app/features/settings/notifications/emailsList'
import { Screen } from 'app/design/layout'
import { HeaderLink } from 'app/design/settings/HeaderLink'

function Notificationss() {
    const notifications = useNotifications()
    const channels = trpc.channels.get.useQuery()
    const addToken = trpc.channels.addPush.useMutation()
    const removeToken = trpc.channels.remove.useMutation()

    const toggle = async () => {
        if (pushState) {
            // deregister
            removeToken.mutate({
                address: notifications?.token!,
            })
        } else {
            // register
            const token = await notifications?.enablePush()
            if (token) {
                addToken.mutate({
                    token: token
                })
            }
        }
    }

    const [pushState, setPushState] = useState(false)

    useEffect(() => {


        if(notifications && notifications.token && channels.data) {
            if(channels.data.find(element => element.address == notifications.token)) {
                setPushState(true)
            }
            else {
                setPushState(false)
            }
        }
        else {
            setPushState(false)
        }
    }, [notifications, notifications?.token, channels.data])

    return (
        <Screen width="max-w-xl">
            <SettingsGroup>
                <SettingsRow headerChild={<Switch
                    onValueChange={toggle}
                    value={pushState}
                />} separator={false} label="Push Benachrichtigungen" description="Aktiviere Push Benachrichtigungen auf diesem Gerät für alle Mitteilungsarten" />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsRow headerChild={<HeaderLink href="addMail" />} separator={false} label="Zusätzliche Emails für Warnungen" description="Erhalte Warnungen über den Zustand deiner Freunde über folgende weitere Email Adressen">
                    <EmailsList />
                </SettingsRow>
            </SettingsGroup>
        </Screen>
    )

    /*
    return (
        <Screen width="max-w-xl">
                <SettingsGroup title="Benachrichtigungen">
                    <SettingsRow label="Push Benachrichtigungen" description="Aktiviere Push Benachrichtigungen auf diesem Gerät für alle Mitteilungsarten">
                        <Switch
                            onValueChange={toggle}
                            value={pushState}
                        />
                    </SettingsRow>
                    <SettingsRow label="Zusätzliche Emails für Warnungen" description="Erhalte Warnungen über den Zustand deiner Freunde über folgende weitere Email Adressen" fullsize={true}>
                        <EmailsList />
                    </SettingsRow>
                </SettingsGroup>
                </Screen>
    )

     */
}

export const Notifications = gestureHandlerRootHOC(Notificationss)
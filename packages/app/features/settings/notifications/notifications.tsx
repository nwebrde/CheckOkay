import { Button, StyledLink } from 'app/design/button'
import { useNotifications } from 'app/provider/notifications'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Switch } from 'react-native'
import { trpc } from 'app/provider/trpc-client'
import React, { useEffect, useState } from 'react'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import EmailsList from 'app/features/settings/notifications/emailsList'
import Screen from 'app/design/screen'
import { HeaderLink } from 'app/design/settings/HeaderLink'
import { Text } from 'app/design/typography'
import { View } from 'app/design/view'
import { Skeleton } from 'moti/skeleton'
import { openAppSettings, useNotificationPermissions } from 'app/lib/notifications/permissionsUtil'

const criticalAlerts = (enabled: boolean) => {
    if(enabled) {
        return <View className="flex flex-row items-center gap-1"><Text className="text-[#c9ba97] font-medium">aktiviert</Text></View>
    }

    return <Button text="aktivieren" />
}

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
            setPushState(false)
        } else {
            // register
            const token = await notifications?.enablePush()
            if (token) {
                addToken.mutate({
                    token: token
                })
                setPushState(true)
            }
        }
    }

    const permissions = useNotificationPermissions()
    const [pushState, setPushState] = useState(false)

    useEffect(() => {
        if(!permissions.push && pushState) {
            setPushState(false)
        }
        if(permissions.push && notifications && notifications.token && channels.data) {
            if(channels.data.find(element => element.address == notifications.token)) {
                setPushState(true)
            }
            else {
                setPushState(false)
            }
        }
    }, [permissions.push, notifications?.token, channels.data])

    return (
        <Screen width="max-w-xl">
            <SettingsGroup>
                <SettingsRow headerChild={<Switch
                    onValueChange={toggle}
                    value={pushState}
                />} separator={pushState} label="Push Benachrichtigungen" description="Aktiviere Push Benachrichtigungen auf diesem Gerät für alle Mitteilungsarten" />
                {pushState &&
                    <SettingsRow label="Kritische Hinweise" linkTitle="Anpassen" separator={false} onPress={openAppSettings}>
                    <>
                    {permissions.critical &&
                        <Text type="labelDescription"><Text type="unstyled" className="font-bold">Kritische Hinweise sind aktiviert.</Text> Wenn du auf Benachrichtigungen nicht reagierst senden wir kritische Hinweise mit lautem Ton, die den Nicht Stören Modus durchbrechen</Text>
                    }
                    {!permissions.critical &&
                        <Text type="labelDescription"><Text type="unstyled" className="font-bold">Kritische Hinweise sind deaktiviert.</Text> Aktiviere sie, wenn du Hinweise mit lautem Ton, die den Nicht Stören Modus durchbrechen, erhalten möchtest</Text>
                    }
                    </>
        </SettingsRow>
                }
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
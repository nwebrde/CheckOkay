import { useNotifications } from 'app/provider/notifications'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Switch } from 'react-native'
import { trpc } from 'app/provider/trpc-client'
import React, { useEffect, useState } from 'react'
import { Text } from 'app/design/typography'
import { openAppSettings, useNotificationPermissions } from 'app/lib/notifications/permissionsUtil'

export function PushNotifications() {
    const notifications = useNotifications()
    const channels = trpc.channels.get.useQuery()
    const addToken = trpc.channels.addPush.useMutation()
    const removeToken = trpc.channels.remove.useMutation()

    const togglePush = async () => {
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
            <SettingsGroup>
                <SettingsRow headerChild={<Switch
                    onValueChange={togglePush}
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
    )

}
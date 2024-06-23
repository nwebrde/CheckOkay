import { H1 } from 'app/design/typography'
import { Button } from 'app/design/button'
import { useNotifications } from 'app/provider/notifications'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Switch } from 'react-native'
import { trpc } from 'app/provider/trpc-client'
import { useEffect, useState } from 'react'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import EmailsList from 'app/features/settings/notifications/emailsList'

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
            <>
                <EmailsList />
                <SettingsGroup title="Benachrichtigungen">
                    <SettingsRow label="Push Benachrichtigungen">
                        <Switch
                            onValueChange={toggle}
                            value={pushState}
                        />
                    </SettingsRow>
                    <SettingsRow label="Zusätzliche Emails für Warnungen" fullsize={true}>
                        <EmailsList />
                    </SettingsRow>
                </SettingsGroup>
                </>
    )
}

export const Notifications = gestureHandlerRootHOC(Notificationss)
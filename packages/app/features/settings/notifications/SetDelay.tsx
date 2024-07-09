'use client'
import React, { forwardRef, useState, useImperativeHandle, useRef, useEffect } from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import { Screen } from 'app/design/layout'
import { TextInput } from 'react-native'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Button } from 'app/design/button'
import Toast from 'react-native-toast-message';
import { Input } from 'app/design/input'
import { TimePicker } from 'app/design/timepicker/timepicker'
import { Skeleton } from 'moti/skeleton'
import { HandlerRef } from 'app/design/modal/types'
import { View } from 'app/design/view'
import * as Burnt from 'burnt'

type Props = {}

/**
 * Only shown on small devices.
 * On large devices, the SettingsNavigator is used for navigation and displayed as an sidebar
 * (see nextjs and expo layouts)
 * @constructor
 */
export const SetDelay = forwardRef<HandlerRef, Props>((props, ref) => {
    const checkSettings = trpc.checks.getSettings.useQuery()
    const delayMutation = trpc.checks.modifyNotifyBackupAfter.useMutation({
        onError: () => {
            Burnt.toast({
                title: "Fehler", // required

                preset: "error", // or "error", "none", "custom"

                message: "Verzögerungszeit wurde nicht gespeichert", // optional

                haptic: "error", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });
        }
    })
    const modifyDelay = (hour: number, minute: number) => {
        delayMutation.mutate({
            hour: hour,
            minute: minute,
        })
    }

    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)

    useEffect(() => {
        if(checkSettings.data) {
            setHour(checkSettings.data.notifyBackupAfter.hour)
            setMinute(checkSettings.data.notifyBackupAfter.minute)
        }
    }, [checkSettings.data])

    useImperativeHandle(ref, () => {
        return {
            proceedHandler,
            state: delayMutation.status
        }
    }, [hour, minute, delayMutation.status])

    const proceedHandler = async () => {
        return delayMutation.mutateAsync({ hour: hour, minute: minute })
    }

    return (
            <View className="self-center p-5 pt-10">
            <Skeleton colorMode="light" width={'100%'}>
                {checkSettings.data &&
            <TimePicker onChange={(hour, minute) => {setHour(hour); setMinute(minute)}} displayTimeInLocalFormat={false} hour={checkSettings.data.notifyBackupAfter.hour} minute={checkSettings.data.notifyBackupAfter.minute} />
                }
            </Skeleton>
                <Text className="mt-10">Wähle aus, wie viele Stunden und Minuten nach einer fehlenden Rückmeldung deine zweitrangigen Beschützer gewarnt werden sollen. Ziehe dafür die Zahlen an die gewünschte Position</Text>
            </View>
    )
} )

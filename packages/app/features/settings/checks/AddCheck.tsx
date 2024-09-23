'use client'
import React, { forwardRef, useState, useImperativeHandle, useRef, useEffect } from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
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

export const AddCheck = forwardRef<HandlerRef, Props>((props, ref) => {
    const addMutation = trpc.checks.add.useMutation({
        onError: () => {
            Burnt.toast({
                title: "Fehler", // required

                preset: "error", // or "error", "none", "custom"

                message: "Zwischen Checks müssen 30 Minuten liegen", // optional

                haptic: "error", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });
        }
    })

    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)

    useImperativeHandle(ref, () => {
        return {
            proceedHandler,
            state: addMutation.status
        }
    }, [hour, minute, addMutation.status])

    const proceedHandler = async () => {
        return addMutation.mutateAsync({ hour: hour, minute: minute })
    }

    return (
            <View className="self-center p-5 pt-10">


            <TimePicker onChange={(hour, minute) => {setHour(hour); setMinute(minute)}} displayTimeInLocalFormat={true} hour={10} minute={9} />

                <Text className="mt-10">Wähle aus, um wie viel Uhr du dich spätestens rückmelden musst. Ziehe dafür die Zahlen an die gewünschte Position</Text>
            </View>
    )
} )

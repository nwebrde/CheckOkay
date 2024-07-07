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


export type SetReminderHandle = {
    done: () => Promise<boolean>
    state: "idle" | "loading" | "error" | "success"
};
export type Props = {
};

/**
 * Only shown on small devices.
 * On large devices, the SettingsNavigator is used for navigation and displayed as an sidebar
 * (see nextjs and expo layouts)
 * @constructor
 */
export const SetReminder = forwardRef<SetReminderHandle, Props>((props, ref) => {
    const checkSettings = trpc.checks.getSettings.useQuery()
    const reminderMutation = trpc.checks.modifyReminderBeforeCheck.useMutation({
        onError: () => {Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'This is some something 👋'
        })}
    })
    const modifyReminder = (hour: number, minute: number) => {
        reminderMutation.mutate({
            hour: hour,
            minute: minute,
        })
    }

    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)

    useEffect(() => {
        if(checkSettings.data) {
            setHour(checkSettings.data.reminderBeforeCheck.hour)
            setMinute(checkSettings.data.reminderBeforeCheck.minute)
        }
    }, [checkSettings.data])

    useImperativeHandle(ref, () => {
        return {
            done,
            state: reminderMutation.status
        }
    }, [hour, minute, reminderMutation.status])

    const done = async () => {
        return reminderMutation.mutateAsync({ hour: hour, minute: minute })
    }

    return (
        <>
            <Skeleton colorMode="light" width={'100%'}>
                {checkSettings.data &&
            <TimePicker onChange={(hour, minute) => {setHour(hour); setMinute(minute)}} displayTimeInLocalFormat={false} hour={checkSettings.data.reminderBeforeCheck.hour} minute={checkSettings.data.reminderBeforeCheck.minute} />
                }
            </Skeleton>
        </>
    )
} )

'use client'
import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import { Screen } from 'app/design/layout'
import { TextInput } from 'react-native'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Button } from 'app/design/button'
import Toast from 'react-native-toast-message';
import { Input } from 'app/design/input'
import { HandlerRef } from 'app/design/modal/types'


export type AddMailHandle = {
    add: () => Promise<void>
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
export const AddMail = forwardRef<HandlerRef, Props>((props, ref) => {

    const addEmail = trpc.channels.addEmail.useMutation({
        onError: () => {Toast.show({
            type: 'success',
            text1: 'Hello',
            text2: 'This is some something 👋'
        })}
    })
    const [email, setEmail] = useState("");

    useImperativeHandle(ref, () => {
        return {
            proceedHandler,
            state: addEmail.status
        }
    }, [email, addEmail.status])

    const proceedHandler = async () => {
        return addEmail.mutateAsync({ address: email })
    }

    return (
        <>
        <Screen width="max-w-xl">
            <Text>Gebe eine weitere Emailadresse an, an die Warnungen über den Zustand deiner Freunde geschickt werden</Text>
            <Input onChangeText={setEmail} value={email} />
        </Screen>
            <Toast />
        </>
    )
} )

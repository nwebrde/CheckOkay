'use client'
import React, { forwardRef, useState, useImperativeHandle, useRef, useEffect } from 'react'
import { SettingsNavigator } from 'app/features/settings/index/SettingsNavigator'
import { HSpacer, Row, Screen, VSpacer } from 'app/design/layout'
import { ActivityIndicator, TextInput } from 'react-native'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Button } from 'app/design/button'
import { HandlerRef, ModalRef } from 'app/design/modal/types'
import { View } from 'app/design/view'
import { ShareButton } from 'app/design/sharebutton/sharebutton'

type Props = {
    modalRef: React.RefObject<ModalRef> | undefined
}

/**
 * Only shown on small devices.
 * On large devices, the SettingsNavigator is used for navigation and displayed as an sidebar
 * (see nextjs and expo layouts)
 * @constructor
 */
export const Invite = forwardRef<HandlerRef, Props>(({ modalRef }, ref) => {
    const linkMutation = trpc.guards.invite.useMutation()
    const { mutate } = linkMutation

    useEffect(() => {
        mutate()
    }, [mutate])

    useImperativeHandle(ref, () => {
        return {
            proceedHandler,
            state: linkMutation.status
        }
    }, [])

    const proceedHandler = async () => {

    }

    return (
            <View className="p-5 pt-10">
                <Text className="">
                    Tippe auf "Link teilen" und teile den Einladungslink mit einer Person, die du als Beschützer einladen möchtest.
                    Öffnet diese Person den Link und meldet sich an, wird sie dein Beschützer. {'\n'}
                </Text>
                <VSpacer />
                {!linkMutation.isLoading && (
                    <ShareButton
                        link={linkMutation.data!}
                        title="Link teilen"
                        msg="Teile diesen Link mit der Person, die du als Beschützer einladen möchtest"
                        onPress={modalRef?.current?.close}
                    />
                )}
                {linkMutation.isLoading && <ActivityIndicator />}
                <Text type="unstyled" className="font-light text-small mt-5">Möchtest du weitere Beschützer einladen, klicke bitte auf Fertig und starte den Prozess erneut.</Text>
            </View>
    )
} )
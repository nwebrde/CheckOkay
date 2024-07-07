'use client'
import {  P, Text } from 'app/design/typography'
import { View } from 'app/design/view'

import { Linking } from 'react-native'
import { MotiPressable } from 'moti/interactions'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Portal } from '@gorhom/portal'
import React from 'react'

export function CallEmergencyScreen() {
    return (
        <View className="flex-1 items-center justify-center p-3">
            <Text type="H1">Bitte rufe die lokalen Notfalldienste an</Text>
            <P className="mb-10">
                Zu deiner eigenen Sicherheit solltest du den Notfalldienst oder
                deine Familie anrufen. {'\n'}
                CheckOkay kann dir dabei nicht helfen.
            </P>
            <MotiPressable
                onPress={() => Linking.openURL('tel:112')}
                animate={({ hovered, pressed }) => {
                    'worklet'

                    return {
                        scale: pressed ? 0.95 : hovered ? 1.1 : 1,
                        rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg',
                    }
                }}
                transition={{
                    type: 'timing',
                    duration: 150,
                }}
            >
                <Text>&#128222; Rufe 112 an</Text>
            </MotiPressable>
        </View>
    )
}

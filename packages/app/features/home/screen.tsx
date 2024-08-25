'use client'
import Screen from 'app/design/screen'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import React from 'react'
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { VSpacer } from 'app/design/layout'

export function HomeScreen() {
    return (
        <Screen stickyHeaderIndices={[0,2]} stickyHeaderWeb={2} paddingTop={false}>
                <View className="pt-3 max-w-xl">
                    <CheckIn />
                </View>
                <VSpacer />
                <View className="bg-white">
                    <Text type="H1">Zustand deiner Freunde</Text>
                </View>
                <Guarded />
        </Screen>
    )
}

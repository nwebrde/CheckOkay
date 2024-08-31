'use client'
import Screen from 'app/design/screen'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import React from 'react'
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { VSpacer } from 'app/design/layout'
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native'

function SubHeader() {
if (Platform.OS === 'ios') {
    return ( <BlurView intensity={100} tint="extraLight" className="px-3" experimentalBlurMethod="dimezisBlurView">
        <Text type="H1">Zustand deiner Freunde</Text>
    </BlurView>)
}

return (<View className="px-3 bg-white">
    <Text type="H1">Zustand deiner Freunde</Text>
</View>)

}

export function HomeScreen() {
    return (
        <Screen stickyHeaderIndices={[0,2]} stickyHeaderWeb={2} paddingTop={false} paddingSide={false}>
                <View className="pt-3 mx-3 max-w-xl">
                    <CheckIn />
                </View>
                <VSpacer />
            <SubHeader />
            <View className="mx-3">
                <Guarded />
            </View>
        </Screen>
    )
}

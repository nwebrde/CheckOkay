'use client'
import Screen from 'app/design/screen'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import React from 'react'
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { VSpacer } from 'app/design/layout'
import { BlurView } from 'expo-blur';
import { Dimensions, Platform } from 'react-native'

function SubHeader() {
if (Platform.OS === 'web' && Dimensions.get("window").width > 928) {
    return (<View className="px-3 bg-white">
        <Text type="H1">Zustand deiner Freunde</Text>
    </View>)
}

    return ( <BlurView intensity={100} tint="regular" className="px-3" style={{backgroundColor: "rgba(255,255,255,0.8)"}} experimentalBlurMethod="dimezisBlurView">
        <Text type="H1">Zustand deiner Freunde</Text>
    </BlurView>)

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

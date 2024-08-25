'use client'
import Screen from 'app/design/screen'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import React, { useState } from 'react'
import { AvatarName } from 'app/features/user/AvatarName'
import { ScrollView } from 'moti'
import {
    RefreshControl,
} from 'react-native';
import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { VSpacer } from 'app/design/layout'
import { BlurView, ExperimentalBlurMethod } from 'expo-blur';


export function HomeScreen() {
    return (
        <Screen stickyHeaderIndices={[0,2]} stickyHeaderWeb={2} paddingTop={false}>
                <View className="pt-3 max-w-xl">
                    <CheckIn />
                </View>
                <VSpacer />
            <BlurView intensity={85} tint="light" experimentalBlurMethod="dimezisBlurView">
                <Text type="H1">Zustand deiner Freunde</Text>
            </BlurView>

                <Guarded />
        </Screen>
    )
}

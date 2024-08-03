import { HomeScreen } from 'app/features/home/screen'
import { Text } from 'app/design/typography'
import { ChevronRight, Cog6Tooth } from 'app/design/icons'
import { Link, Redirect, Stack, useNavigation } from 'expo-router'
import React from 'react'
import { Logo } from 'app/design/logo'
import { AnimatedLink, Button } from 'app/design/button'
import { AvatarName } from 'app/features/user/AvatarName'

export default function Page() {
    return (
        <>
            <Stack.Screen options={{ headerLargeTitle: false, title: 'Zurück',
                headerTitle: props => <Logo className="h-[3.5rem] top-0 mt-0 p-0" />,
                headerRight: () => <AnimatedLink href="/settings">
                    <Cog6Tooth className="text-primary stroke-primary" />
                </AnimatedLink>,
                headerLeft: () => <AvatarName small href="settings/(small)/user" />
            }}

            />
            <HomeScreen />
        </>)
}

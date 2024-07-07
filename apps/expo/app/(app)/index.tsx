import { HomeScreen } from 'app/features/home/screen'
import { Text } from 'app/design/typography'
import { ChevronRight } from 'app/design/icons'
import { Link, Redirect, Stack, useNavigation } from 'expo-router'
import React from 'react'
import { Logo } from 'app/design/logo'
import { Button } from 'app/design/button'

export default function Page() {
    return (
        <>
            <Stack.Screen options={{ headerLargeTitle: false, title: 'Zurück',
                headerTitle: props => <Logo className="h-[3.5rem] top-0 mt-0 p-0" /> }} />
            <HomeScreen />
        </>)
}

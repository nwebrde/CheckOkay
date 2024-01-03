'use client'
import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'

import { MotiLink } from 'solito/moti/app'
import { trpc } from 'app/provider/trpc-client'
import { useAuth } from 'app/provider/auth-context'
import { Button } from 'app/design/button'

import { TimePicker } from 'app/design/timepicker/timepicker'
import ChecksList from 'app/features/settings/checks/ChecksList'

export function SettingsScreen() {
    return (
        <View className="mt-10 flex-1 items-center justify-center p-3">
            <H1>Kontrollzeitpunkte</H1>
            <ChecksList />
        </View>
    )
}

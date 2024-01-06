'use client'
import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row, Screen } from 'app/design/layout'
import { View } from 'app/design/view'

import { MotiLink } from 'solito/moti/app'
import { trpc } from 'app/provider/trpc-client'
import { useAuth } from 'app/provider/auth-context'
import { Button } from 'app/design/button'

import { useRouter } from 'solito/navigation'
import { CheckOkay } from 'app/features/checkIn/CheckOkay'
import { Guards } from 'app/features/settings/guards/Guards'

export function HomeScreen() {
    const router = useRouter()
    const { user, signOut } = useAuth()!

    return (
        <Screen width="max-w-xl">
            <CheckOkay />
        </Screen>
    )
}

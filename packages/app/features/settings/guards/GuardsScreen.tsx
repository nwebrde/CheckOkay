import { Button, StyledLink } from 'app/design/button'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Switch } from 'react-native'
import { trpc } from 'app/provider/trpc-client'
import React, { useEffect, useState } from 'react'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { Screen } from 'app/design/layout'
import { Link } from 'expo-router'
import { Text, TextLink } from 'app/design/typography'
import { Plus } from 'app/design/icons'
import { View } from 'app/design/view'
import { HeaderLink } from 'app/design/settings/HeaderLink'
import GuardsList from 'app/features/settings/guards/GuardsList'

function Guardss() {

    return (
        <Screen width="max-w-xl">
            <SettingsGroup>
                <SettingsRow headerChild={<HeaderLink href="invite" />} separator={false} label="Beschützer" description="Wir warnen diese Personen wenn du dich nicht rechtzeitig zurückmeldest">
                    <GuardsList />
                </SettingsRow>
            </SettingsGroup>
        </Screen>
    )
}

export const GuardsScreen = gestureHandlerRootHOC(Guardss);
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import Screen from 'app/design/screen'
import { SettingsRow } from 'app/design/settings/row'
import { HeaderLink } from 'app/design/settings/HeaderLink'
import { SettingsGroup } from 'app/design/settings/group'
import React from 'react'
import ChecksList from 'app/features/settings/checks/ChecksList'
import { Linking, Platform, Switch } from 'react-native'
import { useSteps } from 'app/provider/steps'
import { Text } from 'app/design/typography'
import { Button } from 'app/design/button'
import { View } from 'app/design/view'

function AutomaticCheckIn() {
    if(Platform.OS == "ios" || Platform.OS == "android") {
        const {state, backgroundState, toggle, toggleBackground, needOverwrite, needPedometerOverwrite, needBackgroundOverwrite} = useSteps()!
        return (
            <SettingsGroup title="Automatische Rückmeldung">
            <SettingsRow headerChild={<Switch
                onValueChange={toggle}
                value={state}
            />} label="Status" separator={state} description="Du wirst automatisch zurückgemeldet wenn du dich in einem Rückmeldezeitfenster mit dem Gerät bewegst und nach oder während der Bewegung dein Gerät entsperrst. Die automatische Rückmeldung funktioniert auch bei komplett geschlossener CheckOkay App">
                {needOverwrite &&
                <Text>Du musst in den Systemeinstellungen unter Datenschutz & Sicherheit {'>'} Health {'>'} CheckOkay den Zugriff auf Schritte zulassen.</Text>
                }
            </SettingsRow>
                {state &&
                <SettingsRow headerChild={<Switch
                    onValueChange={toggleBackground}
                    value={backgroundState}
                />} label="Hintergrundüberprüfung" separator={false} description="Mit dieser Option werden Schritte zusätzlich im Hintergrund überprüft, auch wenn dein Gerät nicht entsperrt ist. Die CheckOkay App muss hierfür im Hintergrund laufen und ein mal täglich geöffnet werden">
                    {needPedometerOverwrite &&
                        <Text>Du musst in den Systemeinstellungen unter CheckOkay den Zugriff auf Bewegung & Fitness zulassen.</Text>
                    }
                    {needBackgroundOverwrite &&
                        <Text>Du musst in den Systemeinstellungen unter CheckOkay die Hintergrundaktualisierung aktivieren.</Text>
                    }
                    {(needPedometerOverwrite || needBackgroundOverwrite) &&
                        <View className="mt-5">
                            <Button text="Öffne Einstellungen" onClick={Linking.openSettings} />
                        </View>
                    }
                </SettingsRow>
                }
            </SettingsGroup>
        )
    }
    return (<></>)
}

function ChecksScreenn() {
    return(
        <Screen width="max-w-xl">
            <SettingsGroup>
                <SettingsRow headerChild={<HeaderLink href="addCheck" />} separator={false} label="Kontrollzeitpunkte" description="Konfiguriere die Zeitpunkte zu denen du dich in der App zurückmelden musst">
                    <ChecksList />
                </SettingsRow>
            </SettingsGroup>
            <AutomaticCheckIn />
        </Screen>
    )
}

export const ChecksScreen = gestureHandlerRootHOC(ChecksScreenn)
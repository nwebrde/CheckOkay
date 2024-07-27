
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'

export default function SignInScreen() {
    return (
        <>
            <Screen></Screen>
            <SettingsGroup>
                <SettingsRow label={"Sign in with "} separator onPress={() => {}} />
            </SettingsGroup>

        </>
    )
}

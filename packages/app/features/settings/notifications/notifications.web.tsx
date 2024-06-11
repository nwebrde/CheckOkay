import { View } from 'app/design/view'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'

export function Notifications() {
    return (
        <View>
            <SettingsGroup title="Notifications">
                <SettingsRow label="Zusätzliche Emails" fullsize={true}>
                    <></>
                </SettingsRow>
            </SettingsGroup>
        </View>
    )
}
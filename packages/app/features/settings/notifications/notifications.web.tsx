import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import EmailsList from 'app/features/settings/notifications/emailsList'

export function Notifications() {
    return (
            <SettingsGroup title="Benachrichtigungen">
                <SettingsRow label="Zusätzliche Emails für Warnungen" fullsize={true}>
                    <EmailsList />
                </SettingsRow>
            </SettingsGroup>
    )
}


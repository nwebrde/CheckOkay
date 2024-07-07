import { View } from 'app/design/view'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import React from 'react'
import { Text } from 'app/design/typography'
import { Link } from 'solito/link'

export function SettingsNavigator({ header, currentPath }: { header: boolean, currentPath: string }) {
    return (
        <View>
            {header &&
                <>
                    <Link href="/"><Text>Zurück</Text></Link>
                    <Text type="H1" className="mt-0.5">Einstellungen</Text>
                </>
            }
            <SettingsGroup>
                <SettingsRow label="Check-In Zeitpunkte" separator={false} />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsRow label="Deine Beschützer" separator={false} />
            </SettingsGroup>
            <SettingsGroup title="Benachrichtigungen">
                <SettingsRow label="Erinnerungen und zeitverzögerte Warnungen" active={currentPath.includes("reminder_delay")} link={"reminder_delay"} />
                <SettingsRow label="Erhalte Benachrichtigungen über" active={currentPath.includes("channels")} link={"channels"} separator={false} />
            </SettingsGroup>

        </View>
    )
}
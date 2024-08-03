import { View } from 'app/design/view'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import React from 'react'
import { Text } from 'app/design/typography'
import { Link } from 'solito/link'
import { useAuth } from 'app/provider/auth-context'

export function SettingsNavigator({ header, currentPath, useRelative }: { header: boolean, currentPath: string, useRelative: boolean }) {
    const auth = useAuth()
    return (
        <View>
            {header &&
                <>
                    <Link href="/"><Text>Zurück</Text></Link>
                    <Text type="H1" className="mt-0.5">Einstellungen</Text>
                </>
            }
            <SettingsGroup title="Profil">
                {
                    /*
                    <SettingsRow label="Anmeldeinformationen" active={currentPath.includes("user")} link={"user"} useRelative={useRelative} separator={true} />
                <SettingsRow label="Notfalldaten" active={currentPath.includes("user")} link={"user"} useRelative={useRelative} separator={false} />
                     */
                }

                <SettingsRow label="Öffentliches Profil" active={currentPath.includes("user")} link={"user"} useRelative={useRelative} separator={true} />
                <SettingsRow label="Konto löschen" link={"user/deleteUser"} useRelative={useRelative} />
                <SettingsRow label="Abmelden" onPress={auth?.signOut} separator={false} />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsRow label="Check-In Zeitpunkte" active={currentPath.includes("checks")} link="checks" useRelative={useRelative} separator={false} />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsRow label="Deine Beschützer" active={currentPath.includes("guards")} link="guards" useRelative={useRelative} separator={false} />
            </SettingsGroup>
            <SettingsGroup title="Benachrichtigungen">
                <SettingsRow label="Erinnerungen und zeitverzögerte Warnungen" active={currentPath.includes("reminder_delay")} link={"reminder_delay"} useRelative={useRelative} />
                <SettingsRow label="Erhalte Benachrichtigungen über" active={currentPath.includes("channels")} link={"channels"} separator={false} useRelative={useRelative} />
            </SettingsGroup>

        </View>
    )
}
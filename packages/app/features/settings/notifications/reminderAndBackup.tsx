import { Screen } from 'app/design/layout'
import { SettingsRow } from 'app/design/settings/row'
import { SettingsGroup } from 'app/design/settings/group'
import React from 'react'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'

function formatReminderTime(hour: number, minute: number) {
    let hourString = ""
    let minuteString = ""
    if(hour == 1) {
        hourString = hour + " Stunde"
    }
    else if(hour > 1) {
        hourString = hour + " Stunden"
    }

    if(minute == 1) {
        minuteString = minute + " Minute"
    }
    else if(minute > 1) {
        minuteString = minute + " Minuten"
    }

    return hourString + ((hourString == "" || minuteString == "") ? "" : " und ") + minuteString
}

export function ReminderAndBackupScreen() {
    const checkSettings = trpc.checks.getSettings.useQuery()

    return(
        <Screen width="max-w-xl">
            <SettingsGroup>
                <SettingsRow label="Erinnerungen" link="reminder_delay/setReminder" linkTitle="Anpassen" fullsize>
                    <Skeleton colorMode="light" width={'100%'}>
                        {checkSettings.data &&
                            <>
                                <Text type="labelDescription">Falls du dich noch nicht zurückgemeldet hast, erinnern wir dich <Text type="unstyled" className="font-bold">{formatReminderTime(checkSettings.data.reminderBeforeCheck.hour, checkSettings.data.reminderBeforeCheck.minute)}</Text> vor dem nächsten Check-In Zeitpunkt</Text>
                            </>
                        }
                    </Skeleton>
                </SettingsRow>
                <SettingsRow separator={false} label="Zeitverzögerte Warnungen" description="Zweitrangige Beschützer werden erst später gewarnt wenn du nicht resagierst. Lege hier die Verzögerungsdauer fest." fullsize={true}>
                </SettingsRow>
            </SettingsGroup>
        </Screen>
    )
}
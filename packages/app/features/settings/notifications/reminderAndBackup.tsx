import { SettingsRow } from 'app/design/settings/row'
import { SettingsGroup } from 'app/design/settings/group'
import React from 'react'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'
import Screen from 'app/design/screen'

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
                <SettingsRow label="Erinnerungen" link="setReminder" linkTitle="Anpassen">
                    <Skeleton colorMode="light" width={'100%'}>
                        {checkSettings.data &&
                            <>
                                <Text type="labelDescription">Falls du dich noch nicht zurückgemeldet hast, erinnern wir dich <Text type="unstyled" className="font-bold">{formatReminderTime(checkSettings.data.reminderBeforeCheck.hour, checkSettings.data.reminderBeforeCheck.minute)}</Text> und noch ein mal <Text type="unstyled" className="font-bold">5 Minuten</Text> vor dem nächsten Check-In Zeitpunkt</Text>
                            </>
                        }
                    </Skeleton>
                </SettingsRow>
                <SettingsRow separator={false} label="Zeitverzögerte Warnungen" link="setDelay" linkTitle="Anpassen">
                    <Skeleton colorMode="light" width={'100%'}>
                        {checkSettings.data &&
                            <>
                                <Text type="labelDescription">Zweitrangige Beschützer werden erst später gewarnt wenn du nicht resagierst. Wir warnen zweitrangige Beschützer <Text type="unstyled" className="font-bold">{formatReminderTime(checkSettings.data.notifyBackupAfter.hour, checkSettings.data.notifyBackupAfter.minute)}</Text> nach einer verpassten Rückmeldung</Text>
                            </>
                        }
                    </Skeleton>
                </SettingsRow>
            </SettingsGroup>
        </Screen>
    )
}
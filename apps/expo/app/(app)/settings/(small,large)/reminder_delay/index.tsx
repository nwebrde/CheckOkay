import { Stack } from 'expo-router'
import { Notifications } from 'app/features/settings/notifications/notifications'
import React from 'react'
import { ReminderAndBackupScreen } from 'app/features/settings/notifications/reminderAndBackup'


export default function Page() {
    return (
        <>
            <Stack.Screen options={{headerTitle: "Erinnerungen und zeitverzögerte Warnungen"}} />
            <ReminderAndBackupScreen />
        </>
    )
}
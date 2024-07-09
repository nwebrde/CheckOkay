import { Stack } from 'expo-router'
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
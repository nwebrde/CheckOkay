import { View } from 'app/design/view'
import { TimePicker } from 'app/design/timepicker/timepicker'
import { Label } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'

export function CheckSettings() {
    const checkSettings = trpc.checks.getSettings.useQuery()
    const backupMutation = trpc.checks.modifyNotifyBackupAfter.useMutation()
    const reminderMutation = trpc.checks.modifyReminderBeforeCheck.useMutation()
    const modifyBackup = (hour: number, minute: number) => {
        backupMutation.mutate({
            hour: hour,
            minute: minute,
        })
    }
    const modifyReminder = (hour: number, minute: number) => {
        reminderMutation.mutate({
            hour: hour,
            minute: minute,
        })
    }
    return (
        <>
            {checkSettings.data && (
                <View className="flex-row flex-wrap gap-8">
                    <View className="flex-col">
                        <Label>Warne Backup Guards nach</Label>
                        <TimePicker
                            hour={checkSettings.data.notifyBackupAfter.hour}
                            minute={checkSettings.data.notifyBackupAfter.minute}
                            onChange={modifyBackup}
                            unit="Stunden"
                        />
                    </View>
                    <View className="flex-col">
                        <Label>Benachrichtige mich vor Checks</Label>
                        <TimePicker
                            hour={checkSettings.data.reminderBeforeCheck.hour}
                            minute={
                                checkSettings.data.reminderBeforeCheck.minute
                            }
                            onChange={modifyReminder}
                            unit="Stunden"
                        />
                    </View>
                </View>
            )}
        </>
    )
}

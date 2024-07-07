import { View } from 'app/design/view'
import { TimepickerOld } from 'app/design/timepicker/timepickerOld'
import { Label } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet } from 'react-native'

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
            <View className="flex-row flex-wrap gap-8">
                <View className="flex-col">
                    <Label>Warne Backup Guards nach</Label>
                    <Skeleton colorMode="light" width={'100%'}>
                        {checkSettings.data && (
                            <TimepickerOld
                                hour={checkSettings.data.notifyBackupAfter.hour}
                                minute={
                                    checkSettings.data.notifyBackupAfter.minute
                                }
                                onChange={modifyBackup}
                                unit="Stunden"
                            />
                        )}
                    </Skeleton>
                </View>
                <View className="flex-col">
                    <Label>Benachrichtige mich vor Checks</Label>
                    <Skeleton colorMode="light" width={'100%'}>
                        {checkSettings.data && (
                            <TimepickerOld
                                hour={
                                    checkSettings.data.reminderBeforeCheck.hour
                                }
                                minute={
                                    checkSettings.data.reminderBeforeCheck
                                        .minute
                                }
                                onChange={modifyReminder}
                                unit="Stunden"
                            />
                        )}
                    </Skeleton>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    shape: {
        justifyContent: 'center',
        height: 250,
        width: 250,
        borderRadius: 25,
        marginRight: 10,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    padded: {
        padding: 16,
    },
})

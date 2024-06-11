import * as Notifications from 'expo-notifications';

export type NotificationsContextType = {
    token: string | undefined
    notification: Notifications.Notification | undefined
    enablePush: () => Promise<string | undefined>
}

import { Provider } from 'app/provider'
import React, { useEffect } from 'react'
import { Slot } from 'expo-router'
import LogRocket from '@logrocket/react-native';
import "app/global.css"
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'

/*
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error, executionInfo }) => {
    let senderId = undefined

    await fetch('https://app.checkokay.com/api/report', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'ReportName': "background-notification.fired",
            'ReportDescription': ""
        }
    });

    console.error("checkokay.background.1")

    // @ts-ignore
    if (data && data.UIApplicationLaunchOptionsRemoteNotificationKey && data.UIApplicationLaunchOptionsRemoteNotificationKey.body && data.UIApplicationLaunchOptionsRemoteNotificationKey.body.sender) {
        // @ts-ignore
        senderId = data.UIApplicationLaunchOptionsRemoteNotificationKey.body.sender.id;
    }

    console.error("checkokay.background.2", senderId)

    const presentedNotifications = await Notifications.getPresentedNotificationsAsync()

    for (const presentedNotification of presentedNotifications) {
        switch (presentedNotification.request.content.data.categoryId) {
            case "reminder":
                console.error("checkokay.background.3", presentedNotification.request.content.data.sender.id)
                if (presentedNotification.request.content.data.sender.id == senderId) {
                    console.error("checkokay.background.4")
                    await Notifications.dismissNotificationAsync(presentedNotification.request.identifier)
                    console.error("checkokay.background.5")
                }
                break;
            case "warning":
                console.error("checkokay.background.6", presentedNotification.request.content.data.sender.id)
                if (presentedNotification.request.content.data.sender.id == senderId) {
                    console.error("checkokay.background.7")
                    await Notifications.dismissNotificationAsync(presentedNotification.request.identifier)
                    console.error("checkokay.background.8")
                }
                break;
            default:
                break;
        }
    }
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

 */

export default function Root() {

    useEffect(() => {
        if(process.env.EXPO_PUBLIC_LOGROCKET_APPID && process.env.EXPO_PUBLIC_LOGROCKET_APPID !== "") {
            LogRocket.init(process.env.EXPO_PUBLIC_LOGROCKET_APPID)
        }
    }, [])

    return (
        <Provider>
            <Slot />
        </Provider>
    )
}
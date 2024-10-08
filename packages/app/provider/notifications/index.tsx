import { AppState, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NotificationsContextType } from 'app/provider/notifications/types'
import { Text } from 'app/design/typography'
import { View } from 'app/design/view'
import Constants from 'expo-constants'
import { Button } from 'app/design/button'
import { VSpacer } from 'app/design/layout'
import { openAppSettings } from 'app/lib/permissions/notificationPermissionUtil'
import { trpc } from 'app/provider/trpc-client'
import * as TaskManager from 'expo-task-manager';
import UserDefaults from "@alevy97/react-native-userdefaults";
import { pedometerCheckIn } from 'app/provider/steps'

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => handleBackgroundNotification(data));

const handleBackgroundNotification = async (data) => {

    let categoryId = undefined

    // @ts-ignore
    if (data && data.UIApplicationLaunchOptionsRemoteNotificationKey && data.UIApplicationLaunchOptionsRemoteNotificationKey.body && data.UIApplicationLaunchOptionsRemoteNotificationKey.body.categoryId) {
        // @ts-ignore
        categoryId = data.UIApplicationLaunchOptionsRemoteNotificationKey.body.categoryId;
    }

    console.error('checkokay.background.noti', categoryId);
    await pedometerCheckIn("backgroundNoti." + categoryId ?? "undefined")
    // Do something with the notification data
}

const groupDefaults = new UserDefaults("group.de.nweber.checkokay.nse");

const NotificationsContext = React.createContext<NotificationsContextType | null>(null)

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

enum ActionIdentifiers {
    CHECKIN = "checkin",
    EXTERNAL_CHECKIN = "externalcheckin",
    PAUSE = "pause",
}

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync(setToken: (token: string | undefined) => void, warningRef:  React.RefObject<BottomSheetMethods>) {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                android: {},
                ios: {
                    allowAlert: true,
                    allowSound: true,
                    allowCriticalAlerts: true,
                }
            });
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            warningRef.current?.open()
            setToken(undefined)
            return undefined;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            setToken(undefined)
            return undefined;
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            setToken(pushTokenString)
            return pushTokenString;
        } catch (e: unknown) {
            setToken(undefined)
            return undefined;
        }
    } else {
        setToken(undefined)
        return undefined;
    }
}

async function init() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Platform.OS === 'ios') {
        await Notifications.setNotificationCategoryAsync("reminder", [{buttonTitle: "Es ist alles okay 👍", identifier: ActionIdentifiers.CHECKIN, options: {
                opensAppToForeground: false,
                isAuthenticationRequired: true
            }}])

        await Notifications.setNotificationCategoryAsync("warning", [{buttonTitle: "Es ist alles okay 👍", identifier: ActionIdentifiers.EXTERNAL_CHECKIN, options: {
                opensAppToForeground: false
            }}, {buttonTitle: "Warnungen für Person pausieren ⏸️", identifier: ActionIdentifiers.PAUSE, options: {
                opensAppToForeground: false,
                isAuthenticationRequired: true,
                isDestructive: true
            }}])
    }
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        if (existingStatus !== 'granted') {
            return undefined;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            return undefined
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            return pushTokenString;
        } catch (e: unknown) {
            return undefined
        }
    } else {
        return undefined
    }
}

export function useNotifications() {
    const value = React.useContext(NotificationsContext)
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useNotifications must be wrapped in a <NotificationsProvider />')
        }
    }

    return value
}

export function NotificationsProvider(props: React.PropsWithChildren) {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const checkInMod = trpc.checks.checkIn.useMutation();
    const pauseMod = trpc.guards.pauseWarningsForGuardedUser.useMutation()
    const checkInExternalMod = trpc.guards.checkInForGuardedUser.useMutation()
    const user = trpc.getUser.useQuery()

    const utils = trpc.useUtils()


    const dismissExpiredNotifications = async () => {
        const user = await utils.getUser.fetch()
        const presentedNotifications = await Notifications.getPresentedNotificationsAsync()
        for (const presentedNotification of presentedNotifications) {
            switch (presentedNotification.request.content.data.categoryId) {
                case "reminder":
                    if(!user.lastCheckIn) {
                        continue;
                    }
                    if (new Date(presentedNotification.date * 1000) <= new Date(user.lastCheckIn)) {
                        await Notifications.dismissNotificationAsync(presentedNotification.request.identifier)
                    }
                    break;
                case "warning":
                    const guardedUser = user.guardedUsers.find((user) => user.id == presentedNotification.request.content.data.sender.id)
                    if(!guardedUser || !guardedUser.nextRequiredCheckIn) {
                        continue;
                    }
                    if (new Date(presentedNotification.date * 1000) < new Date(guardedUser.nextRequiredCheckIn)) {
                        await Notifications.dismissNotificationAsync(presentedNotification.request.identifier)
                    }
                    break;
                case "checkIn":
                    await Notifications.dismissNotificationAsync(presentedNotification.request.identifier)
                    break;
                default:
                    break;
            }
        }
    }


    /*
        instead of addNotificationResponseReceivedListener, the code works also with lastNotificationResponse. For android we probably need to switch to lastNotificationResponse as addNotificationResponseReceivedListener is not working here

    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    const [[lastNotificationIdWithResponseLoading, lastNotificationIdWithResponse], setLastNotificationIdWithResponse] =
        useStorageState('lastNotificationIdWithResponse')

    useEffect(() => {
        console.error("checkokay.step2", !lastNotificationIdWithResponseLoading, lastNotificationResponse != undefined && lastNotificationResponse != null, lastNotificationResponse?.notification.request.identifier != lastNotificationIdWithResponse, auth != null, !auth?.isLoading);
        if (
            lastNotificationResponse &&
            !lastNotificationIdWithResponseLoading &&
            lastNotificationResponse.notification.request.identifier != lastNotificationIdWithResponse &&
            lastNotificationResponse.notification.request.content.data &&
            lastNotificationResponse.actionIdentifier && auth && !auth.isLoading
        ) {
            console.error("checkokay.step3");
            console.error("checkpoint", auth.refreshToken?.length, auth.accessToken?.length, localRefreshToken == auth.refreshToken, localAccessToken == auth.accessToken)
            setLastNotificationIdWithResponse(lastNotificationResponse.notification.request.identifier)
            setLocalAccessToken(auth.accessToken)
            setLocalRefreshToken(auth.refreshToken)
            console.error("checkpoint 2", auth.refreshToken, auth.accessToken, localRefreshToken, localAccessToken)
            let userId = undefined
            if(lastNotificationResponse.notification.request.content.data.sender) {
                userId = lastNotificationResponse.notification.request.content.data.sender.id;
            }


            console.error("checkokay.step4: "+userId)
            console.error("checkokay.step4a: " + lastNotificationResponse.actionIdentifier)
            switch (lastNotificationResponse.actionIdentifier) {
                case ActionIdentifiers.CHECKIN:
                    checkInMod.mutate({step: false})
                    break;
                case ActionIdentifiers.EXTERNAL_CHECKIN:
                    console.error("checkokay.step4b")
                    console.error("checkokay.step4c: ", pauseMod.status)
                    checkInExternalMod.mutate({guardedUserId: userId!})
                    break;
                case ActionIdentifiers.PAUSE:
                    console.error("checkokay.step4b")
                    console.error("checkokay.step4c: ", pauseMod.status)
                    pauseMod.mutate({ guardedUserId: userId!, pause: true })
                    break;
                default:
                    break;
            }
        }
    }, [lastNotificationResponse, lastNotificationIdWithResponseLoading, auth, auth?.isLoading])

     */



    useEffect(() => {
        init()
        .then(token => setExpoPushToken(token))
        .catch((error: any) => setExpoPushToken(undefined));

        TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK).then((state) => {
            if(!state) {
                Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
            }
        })

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
            if (response) {
                let userId = undefined
                if (response.notification.request.content.data.sender) {
                    userId = response.notification.request.content.data.sender.id;
                }

                switch (response.actionIdentifier) {
                    case ActionIdentifiers.CHECKIN:
                        await checkInMod.mutateAsync({ step: false })
                        break;
                    case ActionIdentifiers.EXTERNAL_CHECKIN:
                        await checkInExternalMod.mutateAsync({ guardedUserId: userId! })
                        break;
                    case ActionIdentifiers.PAUSE:
                        await pauseMod.mutateAsync({ guardedUserId: userId!, pause: true })
                        break;
                    default:
                        break;
                }
            }
        });

        dismissExpiredNotifications()

        const handleAppStateChange = (nextAppState) => {
            dismissExpiredNotifications(); // Überprüft Berechtigungen, wenn die App in den Vordergrund kommt
        };

        const appStateChangeSubscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
            appStateChangeSubscription.remove();
        };
    }, []);

    useEffect(() => {
        if(user && user.data) {
            groupDefaults.set("userId", user.data.id);
        }
    }, [user])

    const value = {
        token: expoPushToken,
        notification: notification,
        enablePush: async () => {
            return await registerForPushNotificationsAsync(setExpoPushToken, sheetRef)
        },
    }

    const sheetRef = useRef<BottomSheetMethods>(null);

    return (
        <NotificationsContext.Provider value={value}>
            <>
                {props.children}
                <BottomSheet ref={sheetRef} style={styles.container}>
                    <View className="bg-white w-full p-2 items-center flex flex-col">
                        <Text type="H1">
                            Aktiviere Benachrichtigungen in den Einstellungen
                        </Text>
                        <Text>
                            Damit dich CheckOkay benachrichtigen kann, musst du in den Einstellungen von deinem Gerät Benachrichtigungen aktivieren. Navigiere dazu zu Einstellungen &gt; Mitteilungen &gt; CheckOkay
                        </Text>
                        <View className="mt-10 mb-10">
                            <Button  onClick={openAppSettings} text="Öffne Einstellungen" />
                        </View>
                        <VSpacer className="" />
                    </View>

                </BottomSheet>
            </>
        </NotificationsContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: 'white' } // works fine
})
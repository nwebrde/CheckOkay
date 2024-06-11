import { Platform, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NotificationsContextType } from 'app/provider/notifications/types'
import { H1, Text } from 'app/design/typography'
import { View } from 'app/design/view'
import Constants from 'expo-constants'
import { Button } from 'app/design/button'
import * as Linking from 'expo-linking';
import { VSpacer } from 'app/design/layout'

const NotificationsContext = React.createContext<NotificationsContextType | null>(null)

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync(setToken: (token: string | undefined) => void, warningRef:  React.RefObject<BottomSheetMethods>) {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
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
    useEffect(() => {
        init()
        .then(token => setExpoPushToken(token))
        .catch((error: any) => setExpoPushToken(undefined));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const value = {
        token: expoPushToken,
        notification: notification,
        enablePush: async () => {
            return await registerForPushNotificationsAsync(setExpoPushToken, sheetRef)
        },
    }

    const sheetRef = useRef<BottomSheetMethods>(null);


    const openAppSettings = () => {
        Linking.openSettings()
    }

    return (
        <NotificationsContext.Provider value={value}>
            <>
                {props.children}
                <BottomSheet ref={sheetRef} style={styles.container}>
                    <View className="bg-white w-full h-full p-2">
                        <H1>
                            Aktiviere Benachrichtigungen in den Einstellungen
                        </H1>
                        <Text>
                            Damit dich CheckOkay benachrichtigen kann, musst du in den Einstellungen von deinem Gerät Benachrichtigungen aktivieren. Navigiere dazu zu Einstellungen > Mitteilungen > CheckOkay
                        </Text>
                        <View className="mt-10 w-1/2">
                            <Button  onClick={openAppSettings} text="Öffne Einstellungen" />
                        </View>

                    </View>

                </BottomSheet>
            </>
        </NotificationsContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: 'white' } // works fine
})
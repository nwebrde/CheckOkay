import { useEffect, useState } from 'react'
import { AppState, Platform } from 'react-native'
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking'


const checkNotificationPermissions = async () => {
    const settings = await Notifications.getPermissionsAsync();
    return {
        push: settings.granted,
        critical: settings.ios?.allowsCriticalAlerts ?? false
    }
};

export const useNotificationPermissions = () => {
    const [permissions, setPermissions] = useState({
        push: false,
        critical: false
    });

    useEffect(() => {
        const checkPermissions = async () => {
            const permission = await checkNotificationPermissions();
            setPermissions(permission);
        };

        checkPermissions();

        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                checkPermissions(); // Überprüft Berechtigungen, wenn die App in den Vordergrund kommt
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    return permissions;
};

export const openAppSettings = () => {
    if(Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:NOTIFICATIONS_ID&path=de.nweber.checkokay')
    }
    else {
        Linking.openSettings()
    }
}

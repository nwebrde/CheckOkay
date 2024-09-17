import HealthKit, {
    HKAuthorizationRequestStatus,
    HKQuantityTypeIdentifier,
    HKStatisticsOptions
} from '@kingstinct/react-native-healthkit'
import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { Pedometer } from 'expo-sensors'
import * as BackgroundFetch from 'expo-background-fetch';

const checkIfHealthKitAccessPossible = async () => {
    const state = await HealthKit.getRequestStatusForAuthorization([HKQuantityTypeIdentifier.stepCount])
    if(state !== HKAuthorizationRequestStatus.shouldRequest) {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 7);
        const data = await HealthKit.queryStatisticsForQuantity(HKQuantityTypeIdentifier.stepCount, [HKStatisticsOptions.cumulativeSum], startDate, new Date())

        if(!data || !data.sumQuantity || data.sumQuantity.quantity <= 0) {
            return false
        }
        return true
    }
    return false
}

/**
 * returns whether app now has access to step data or not
 */
const requestHealthKitPermissions = async () => {
    const state = await HealthKit.requestAuthorization([HKQuantityTypeIdentifier.stepCount])
    return await checkIfHealthKitAccessPossible()
}


export const useHealthKitPermissions = () => {
    const [permissions, setPermissions] = useState<boolean | undefined>(undefined);

    const request = async () => {
        const state = await requestHealthKitPermissions()
        setPermissions(state)
    }

    useEffect(() => {
        const checkPermissions = async () => {
            const permission = await checkIfHealthKitAccessPossible();
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

    return {
        healthKitPermission: permissions,
        requestHealthKitPermission: request
    };
}

const checkIfPedometerAccessPossible = async () => {
    if(!(await Pedometer.isAvailableAsync())) {
        return false
    }

    const permissions = await Pedometer.getPermissionsAsync()

    if(permissions.status == Pedometer.PermissionStatus.GRANTED || permissions.granted) {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 7);
        const data = await Pedometer.getStepCountAsync(startDate, new Date())

        if(!data || data.steps <= 0) {
            return false
        }
        return true
    }
    return false
}

/**
 * returns whether app now has access to step data or not
 */
const requestPedometerPermissions = async () => {
    const state = await Pedometer.requestPermissionsAsync()
    return await checkIfPedometerAccessPossible()
}

export const usePedometerPermissions = () => {
    const [permissions, setPermissions] = useState<boolean | undefined>(undefined);
    const [backgroundAvailable, setBackgroundAvailable] = useState<boolean | undefined>(undefined)

    const request = async () => {
        const state = await requestPedometerPermissions()
        setPermissions(state)
    }

    useEffect(() => {
        const checkPermissions = async () => {
            const permission = await checkIfPedometerAccessPossible();
            setPermissions(permission);
            const backgroundStatus = await BackgroundFetch.getStatusAsync();
            setBackgroundAvailable(backgroundStatus == BackgroundFetch.BackgroundFetchStatus.Available);
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

    return {
        pedometerPermission: permissions,
        backgroundAvailable: backgroundAvailable,
        requestPedometerPermission: request
    };
}

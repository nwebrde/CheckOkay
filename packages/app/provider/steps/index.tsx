import HealthKit, {
    HKQuantityTypeIdentifier,
    HKStatisticsOptions,
    HKUnits,
    HKUpdateFrequency,
} from '@kingstinct/react-native-healthkit'
import React, { useEffect, useState } from 'react'
import { trpc } from 'app/provider/trpc-client/index.native'
import { StepsContextType } from 'app/provider/steps/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useHealthKitPermissions, usePedometerPermissions } from 'app/lib/permissions/stepsPermissionUtil'

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Pedometer } from 'expo-sensors';
import { getAccessToken } from 'expo-app/lib/OAuthClient'
import { AppState, AppStateStatus } from 'react-native'

/**
 * returns true if check-in succeeded, false if an error occured and undefined if there are no steps
 * @param issuer
 */
export const pedometerCheckIn = async (issuer: string) => {
    await fetch('https://app.checkokay.com/api/report', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'ReportName': "background.fired." + issuer
        }
    });

    const permissions = await Pedometer.getPermissionsAsync();

    if(!permissions.granted) {
        return false
    }

    let stepCount = 0;
    const MS_PER_MINUTE = 60000;
    let startDate = new Date()

    for (let i = 0; i <= 5; i++) {
        startDate = new Date(startDate.getTime() - 30 * MS_PER_MINUTE);
        stepCount = (await Pedometer.getStepCountAsync(startDate, new Date())).steps;
        if(stepCount > 10) {
            break;
        }
    }

    if(stepCount > 10) {
        // Be sure to return the successful result type!

        const result = await fetch('https://app.checkokay.com/api/checkin', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'steps': stepCount.toString(),
                'accessToken': (await getAccessToken()) ?? "",
                'startTime': startDate.getTime().toString()
            }
        });
        if(result.status == 200) {
            return true
        }
        else {
            return false
        }
    }
    return undefined
}



const BACKGROUND_STEP_TASK = 'background-step';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_STEP_TASK, async () => {

    const result = await pedometerCheckIn("backgroundFetch")

        if(result) {
            return BackgroundFetch.BackgroundFetchResult.NewData;
        }
        else if(result == undefined) {
            return BackgroundFetch.BackgroundFetchResult.NoData;
        }
        else {
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }

});


const StepsContext = React.createContext<StepsContextType | null>(null)


let isBackgroundObserversSetup = false;

const enableBackgroundObservers = async () => {
    if (isBackgroundObserversSetup) {
        return;
    }

    isBackgroundObserversSetup = true;

    await HealthKit.enableBackgroundDelivery(HKQuantityTypeIdentifier.stepCount, HKUpdateFrequency.immediate);
};

const disableBackgroundObservers = async () => {
    if (!isBackgroundObserversSetup) {
        return;
    }

    isBackgroundObserversSetup = false;

    await HealthKit.disableBackgroundDelivery(HKQuantityTypeIdentifier.stepCount);

};

export function useSteps() {
    const value = React.useContext(StepsContext)
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSteps must be wrapped in a <StepsProvider />')
        }
    }

    return value
}

const ASYNC_STORAGE_KEY = 'stepCheckIn';
const ASYNC_STORAGE_KEY_BACKGROUND = 'backgroundCheckIn';

export const StepProvider = ({ children }: { children: React.ReactNode }) => {
    const checkInMutation = trpc.checks.checkIn.useMutation();
    const utils = trpc.useUtils();


    const { healthKitPermission, requestHealthKitPermission } = useHealthKitPermissions()
    const { pedometerPermission, backgroundAvailable, requestPedometerPermission } = usePedometerPermissions()

    const [activated, setActivated] = useState<undefined | boolean>(undefined);
    const [state, setState] = useState<undefined | boolean>(undefined);

    const [backgroundActivated, setBackgroundActivated] = useState<undefined | boolean>(undefined);
    const [backgroundState, setBackgroundState] = useState<undefined | boolean>(undefined);

    const [needHealthOverwrite, setNeedHealthOverwrite] = useState(false);
    const [needPedometerOverwrite, setNeedPedometerOverwrite] = useState(false);
    const [needBackgroundOverwrite, setNeedBackgroundOverwrite] = useState(false);

    const getActivated = async () => {
        const item = await AsyncStorage.getItem(ASYNC_STORAGE_KEY)
        if(item !== null) {
            setActivated(true);
        }
        else {
            setActivated(false);
        }

        const itemTwo = await AsyncStorage.getItem(ASYNC_STORAGE_KEY_BACKGROUND)
        if(itemTwo !== null) {
            setBackgroundActivated(true);
        }
        else {
            setBackgroundActivated(false);
        }
    };

    const toggle = async () => {
        if(state) {
            AsyncStorage.removeItem(ASYNC_STORAGE_KEY)
            AsyncStorage.removeItem(ASYNC_STORAGE_KEY_BACKGROUND)
            setActivated(false)
            setState(false)
            setBackgroundActivated(false)
            setBackgroundState(false)
        }
        if(!state) {
            AsyncStorage.setItem(ASYNC_STORAGE_KEY, 'true');
            setActivated(true)
            await requestHealthKitPermission()
        }
    }

    const toggleBackground = async () => {
        if(backgroundState) {
            AsyncStorage.removeItem(ASYNC_STORAGE_KEY_BACKGROUND)
            setBackgroundActivated(false)
            setBackgroundState(false)
        }
        if(!backgroundState && state) {
            AsyncStorage.setItem(ASYNC_STORAGE_KEY_BACKGROUND, 'true');
            setBackgroundActivated(true)
            await requestPedometerPermission()
        }
    }

    useEffect(() => {
        if(healthKitPermission && activated) {
            setState(true)
            setNeedHealthOverwrite(false)
        }
        if(healthKitPermission !== undefined && !healthKitPermission && activated) {
            setState(false)
            setBackgroundState(false)
            setBackgroundActivated(false)
            setNeedHealthOverwrite(true)
        }
        if(activated !== undefined && !activated) {
            setState(false)
            setBackgroundState(false)
            setNeedHealthOverwrite(false)
        }
    }, [activated, healthKitPermission])

    useEffect(() => {
        if(pedometerPermission && backgroundAvailable && backgroundActivated) {
            setBackgroundState(true)
        }

        if(backgroundAvailable) {
            setNeedBackgroundOverwrite(false)
        }
        if(pedometerPermission) {
            setNeedPedometerOverwrite(false)
        }

        if(((pedometerPermission !== undefined && !pedometerPermission) || (backgroundAvailable !== undefined && !backgroundAvailable)) && backgroundActivated) {
            setBackgroundState(false)

            if(pedometerPermission !== undefined && !pedometerPermission) {
                setNeedPedometerOverwrite(true)
            }

            if(backgroundAvailable !== undefined && !backgroundAvailable) {
                setNeedBackgroundOverwrite(true)
            }
        }

        if(backgroundActivated !== undefined && !backgroundActivated) {
            setBackgroundState(false)
            setNeedPedometerOverwrite(false)
            setNeedBackgroundOverwrite(false)
        }
    }, [backgroundActivated, pedometerPermission, backgroundAvailable])


    useEffect(() => {
        getActivated()
    }, [])

    useEffect(() => {
        if(state) {
            enableBackgroundObservers();
        }
        if(state !== undefined && !state) {
            disableBackgroundObservers();
        }
    }, [state])

    useEffect(() => {
        if(backgroundState) {
            TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK).then((state) =>
                {
                    if(!state) {
                        BackgroundFetch.registerTaskAsync(BACKGROUND_STEP_TASK, {
                            stopOnTerminate: false, // android only,
                            startOnBoot: true, // android only
                        });
                    }
                }
            )
        }
        if(backgroundState !== undefined && !backgroundState) {
            TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK).then((state) =>
                {
                    if(state) {
                        BackgroundFetch.unregisterTaskAsync(BACKGROUND_STEP_TASK);
                    }
                }
            )
        }
    }, [backgroundState])

    /*
    useEffect(() => {

        const subscribeToSteps = async () => {
            await HealthKit.subscribeToChanges(
                HKQuantityTypeIdentifier.stepCount,
                async () => {
                    await fetch('https://app.checkokay.com/api/report', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'ReportName': "health.fired." + AppState.currentState + "." + state
                        }
                    });
                    if(AppState.currentState != "active" && AppState.currentState != "inactive" && state) {
                        const user = await utils.getUser.fetch()
                        let startDate = new Date()
                        startDate.setDate(startDate.getDate() - 1);
                        if(user && user.lastCheckIn) {
                            startDate = new Date(user.lastCheckIn)
                            startDate.setMinutes(startDate.getMinutes() + 1);
                        }
                        const data = await HealthKit.queryStatisticsForQuantity(HKQuantityTypeIdentifier.stepCount, [HKStatisticsOptions.cumulativeSum], startDate, new Date())
                        if(data && data.sumQuantity && data.sumQuantity.quantity >= 10) {
                            const mostRecentEndDate = (await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.stepCount, HKUnits.Count))?.endDate
                            await checkInMutation.mutateAsync({step: true, date: mostRecentEndDate})
                        }
                    }
                }
            );
        }

        subscribeToSteps()

        const subscription = AppState.addEventListener('change', subscribeToSteps);

        return () => {
            subscription.remove();
        }
    }, [state]);

     */

    useEffect(() => {
        fetch('https://app.checkokay.com/api/report', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'ReportName': "health.not-fired." + AppState.currentState
            }
        });
        if(state) {
            HealthKit.subscribeToChanges(
                HKQuantityTypeIdentifier.stepCount,
                async () => {
                    await fetch('https://app.checkokay.com/api/report', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'ReportName': "health.fired." + AppState.currentState
                        }
                    });
                    if(AppState.currentState != "active" && AppState.currentState != "inactive") {
                        const user = await utils.getUser.fetch()
                        let startDate = new Date()
                        startDate.setDate(startDate.getDate() - 1);
                        if(user && user.lastCheckIn) {
                            startDate = new Date(user.lastCheckIn)
                            startDate.setMinutes(startDate.getMinutes() + 1);
                        }
                        const data = await HealthKit.queryStatisticsForQuantity(HKQuantityTypeIdentifier.stepCount, [HKStatisticsOptions.cumulativeSum], startDate, new Date())
                        if(data && data.sumQuantity && data.sumQuantity.quantity >= 10) {
                            const mostRecentEndDate = (await HealthKit.getMostRecentQuantitySample(HKQuantityTypeIdentifier.stepCount, HKUnits.Count))?.endDate
                            await checkInMutation.mutateAsync({step: true, date: mostRecentEndDate})
                        }
                    }
                }
            );
        }
    }, [state])

    const value = {
        toggle: toggle,
        toggleBackground: toggleBackground,
        needOverwrite: needHealthOverwrite,
        needPedometerOverwrite: needPedometerOverwrite,
        needBackgroundOverwrite: needBackgroundOverwrite,
        state: state,
        backgroundState: backgroundState
    }

    return (
        <StepsContext.Provider value={value}>
            {children}
        </StepsContext.Provider>
    )
};
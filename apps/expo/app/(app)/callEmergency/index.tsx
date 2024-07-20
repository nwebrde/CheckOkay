import { CallEmergencyScreen } from 'app/features/checkIn/callEmergencyScreen'
import { Stack } from 'expo-router'
import React from 'react'
export default function Home() {
    return (
        <>
            <Stack.Screen options={{headerTitle: "Notfall"}} />
            <CallEmergencyScreen />
        </>
        )
}

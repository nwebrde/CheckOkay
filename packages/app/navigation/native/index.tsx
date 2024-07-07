import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { HomeScreen } from 'app/features/home/screen'
import { UserDetailScreen } from '../../features/user/detail-screen'
import { SettingsScreen } from 'app/features/settings/screen'
import { Dimensions, Text } from 'react-native'
import { CallEmergencyScreen } from 'app/features/checkIn/callEmergencyScreen'
import { GuardsScreen } from 'app/features/settings/guards/GuardsScreen'

const Stack = createNativeStackNavigator<{
    home: undefined
    settings: undefined
    'user-detail': {
        id: string
    }
}>()

export function NativeNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="home"
                component={HomeScreen}
                options={{
                    title: 'Home',
                }}
            />
            <Stack.Screen
                name="settings"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    headerShown: Dimensions.get('window').width < 750
                }}
            />
            {Dimensions.get('window').width < 750 &&
                <>
            <Stack.Screen
                name="guards"
                component={GuardsScreen}
                options={{
                    title: 'Settings'}}
            />
            <Stack.Screen
                name="emergency"
                component={CallEmergencyScreen}
                options={{
                    title: 'Emergency'}}
            />
                </>
            }

        </Stack.Navigator>
    )
}
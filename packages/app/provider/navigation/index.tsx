import { NavigationContainer } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'

export function NavigationProvider({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <NavigationContainer
            linking={useMemo(
                () => ({
                    prefixes: [Linking.createURL('/')],
                    config: {
                        initialRouteName: 'home',
                        screens: {
                            home: '',
                            'settings': 'settings',
                            'guards': 'settings/guards',
                            'emergency': 'settings/emergency'
                        },
                    },
                }),
                []
            )}
        >
            {children}
        </NavigationContainer>
    )
}
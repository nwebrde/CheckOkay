import { Provider } from 'app/provider'
import React, { useEffect } from 'react'
import { Slot } from 'expo-router'
import LogRocket from '@logrocket/react-native';
import "app/global.css"

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
import { View as ReactNativeView } from 'react-native'
import React from 'react'

export function View({ className, ...props }) {
    return (<ReactNativeView className={className} {...props } />)
}

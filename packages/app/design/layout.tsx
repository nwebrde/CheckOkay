import React, { ReactNode } from 'react'
import { View } from 'app/design/view'
import { RefreshControl } from 'react-native'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Text } from 'app/design/typography'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import { ScrollView } from 'moti'
import { trpc } from 'app/provider/trpc-client'
import { clsx } from 'clsx'
import { AvatarName } from 'app/features/user/AvatarName'
import { Cog6Tooth } from 'app/design/icons'
import { AnimatedLink } from 'app/design/button'

export function Row({ className, ...props }) {
    return (<View className={"flex-row " + className} {...props } />)
}

export function VSpacer({ className, ...props }) {
    return (<View className={"h-12 " + className} {...props } />)
}

export function HSpacer({ className, ...props }) {
    return (<View className={"w-12 " + className} {...props } />)
}

export function Card({ className, ...props }) {
    return (<View className={"p-5 rounded-xl " + className} {...props } />)
}

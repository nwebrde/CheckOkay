import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Guards } from 'app/features/settings/guards/Guards'
import React, { ReactNode } from 'react'
import { View } from 'app/design/view'
import { MotiLink as MLink } from 'solito/build/moti/app'

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
    return (<View className={"p-5 rounded-xl shadow-sm " + className} {...props } />)
}

export const Screen = ({
    children,
    width,
}: {
    children: ReactNode
    width: 'max-w-xl' | 'max-w-2xl'
}) => {
    return (
        <View className="center flex-1 items-center p-3 pt-7 md:justify-center md:pt-0">
            <View className={'w-full' + ' ' + width}>{children}</View>
        </View>
    )
}

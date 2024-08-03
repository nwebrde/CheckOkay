import React, { ReactNode } from 'react'
import { View } from 'app/design/view'
import { RefreshControl } from 'react-native'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Text } from 'app/design/typography'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import { ScrollView } from 'moti'
import { trpc } from 'app/provider/trpc-client'
import { clsx } from 'clsx'

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
    stickyHeaderIndices,
    paddingTop = true,
    width = 'max-w-2xl',
}: {
    children: ReactNode
    stickyHeaderIndices: number[]
    paddingTop: boolean
    width: 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl'
}) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const utils = trpc.useUtils();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await utils.invalidate();
        setRefreshing(false);
    }, []);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            className={clsx("p-3", paddingTop ? "" : "pt-0", width)}
            stickyHeaderIndices={stickyHeaderIndices}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {children}
        </ScrollView>

    )
}

import React, { ReactNode } from 'react'
import { trpc } from 'app/provider/trpc-client'
import { ScrollView } from 'moti'
import { clsx } from 'clsx'
import { RefreshControl } from 'react-native'

const Screen = ({
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

export default Screen
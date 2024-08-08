import React, { ReactNode } from 'react'
import { trpc } from 'app/provider/trpc-client'
import { ScrollView } from 'react-native'
import { clsx } from 'clsx'
import { RefreshControl } from 'react-native'
import { useAuth } from 'app/provider/auth-context'
import { localAccessToken } from 'app/provider/auth-context/state.native'
import { View } from 'app/design/view'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Screen = ({
                           children,
                           stickyHeaderIndices = [],
                           stickyHeaderWeb,
                           paddingTop = true,
                       }: {
    children: ReactNode
    stickyHeaderIndices: number[]
    stickyHeaderWeb?: number
    paddingTop: boolean
}) => {
    const [refreshing, setRefreshing] = React.useState(false);
    const auth = useAuth();

    const utils = trpc.useUtils();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        while (!auth || auth.isLoading || !localAccessToken) {
            await sleep(100);
        }
        await utils.invalidate();
        setRefreshing(false);
    }, []);

    return (
        <View className="flex-1 md:justify-center h-full w-fit">
    <View className={clsx("h-full", "md:max-h-fit", "w-fit")}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            className={clsx("p-3 w-fit", paddingTop ? "" : "pt-0")}
            stickyHeaderIndices={stickyHeaderIndices}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {children}
        </ScrollView>
    </View>
        </View>
    )
}

export default Screen
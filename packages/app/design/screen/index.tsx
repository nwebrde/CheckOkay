import React, { ReactNode } from 'react'
import { trpc } from 'app/provider/trpc-client'
import { ScrollView } from 'react-native'
import { clsx } from 'clsx'
import { RefreshControl } from 'react-native'
import { localAccessToken } from 'app/provider/auth-context/state.native'
import { View } from 'app/design/view'
import { VSpacer } from 'app/design/layout'
import {Dimensions} from 'react-native';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Screen = ({
                           children,
                           stickyHeaderIndices = [],
                           stickyHeaderWeb,
                           paddingTop = true,
                            paddingSide = true,
                            width = "max-w-4xl"
                       }: {
    children: ReactNode
    stickyHeaderIndices: number[]
    stickyHeaderWeb?: number
    paddingTop: boolean
    paddingSide: boolean
    width: string
}) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const utils = trpc.useUtils();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await utils.invalidate();
        setRefreshing(false);
    }, []);

    return (
        <View className="max-h-fit">
    <View className={clsx("self-center", width)}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            className={clsx("w-fit h-fit py-3", paddingSide ? "px-3" : "", paddingTop ? "" : "pt-0")}
            stickyHeaderIndices={stickyHeaderIndices}
            contentContainerStyle={{flexGrow: 1, justifyContent: stickyHeaderIndices.length <= 0 && Dimensions.get('window').width >= 800 ? "center" : "flex-start"}}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {children}
            <VSpacer />
        </ScrollView>
    </View>
        </View>
    )
}

export default Screen
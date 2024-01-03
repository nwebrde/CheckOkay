import React from 'react'

import ChecksListItem from './ChecksListItem'
import type Check from 'app/provider/app-context/types/check'
import { View } from 'app/design/view'
import { Button } from 'app/design/button'
import { LAST_ITEM_ID } from 'app/features/settings/checks/const'
import { Animated, LayoutAnimation } from 'react-native'
import { trpc } from 'app/provider/trpc-client/index'
import FlatList = Animated.FlatList
import { EmptyItem } from 'app/features/settings/checks/EmptyItem'

function pushNewButton(checks?: Check[]) {
    if (!checks) {
        return undefined
    }
    if (checks.some((e) => e.checkId === LAST_ITEM_ID)) {
        return checks
    }
    const returnData = checks
    returnData.push({
        checkId: LAST_ITEM_ID,
        hour: 1,
        minute: 1,
    })
    return returnData
}

const ChecksList = () => {
    const checks = trpc.checks.get.useQuery()

    const layoutAnimConfig = {
        duration: 300,
        update: {
            type: LayoutAnimation.Types.easeInEaseOut,
        },
        delete: {
            duration: 100,
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
    }

    const renderItem = ({ item }: { item: Check }) => {
        return (
            <ChecksListItem
                item={item}
                latestItem={getLatestItem(checks.data)}
            />
        )
    }

    const getLatestItem = (items: Check[] | undefined) => {
        if (items) {
            if (items[items.length - 1]!.checkId == LAST_ITEM_ID) {
                return items[items.length - 2]!
            }
            return items[items.length - 1]!
        }
    }

    return (
        <View>
            <FlatList
                // Saving reference to the `FlashList` instance to later trigger `prepareForLayoutAnimationRender` method.
                numColumns={2}
                // This prop is necessary to uniquely identify the elements in the list.
                keyExtractor={(item: Check) => {
                    return item.checkId
                }}
                renderItem={renderItem}
                ListEmptyComponent={<EmptyItem />}
                data={pushNewButton(checks.data)}
            />
        </View>
    )
}

export default ChecksList

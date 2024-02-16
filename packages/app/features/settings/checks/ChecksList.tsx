import React from 'react'

import ChecksListItem from './ChecksListItem'
import { View } from 'app/design/view'
import { LAST_ITEM_ID } from 'app/features/settings/checks/const'
import { trpc } from 'app/provider/trpc-client'
import { EmptyItem } from 'app/features/settings/checks/EmptyItem'
import { FlatList } from 'react-native'
import { Skeleton } from 'moti/skeleton'
import {Check} from "app/lib/types/check";

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
            <Skeleton
                colorMode="light"
                width={'100%'}
                height={100}
                show={checks.isLoading}
            >
                <FlatList
                    // Saving reference to the `FlashList` instance to later trigger `prepareForLayoutAnimationRender` method.
                    numColumns={5}
                    // This prop is necessary to uniquely identify the elements in the list.
                    keyExtractor={(item: Check) => {
                        return item.checkId
                    }}
                    scrollEnabled={false}
                    columnWrapperStyle={{
                        flexWrap: 'wrap',
                        flex: 1,
                        marginTop: 5,
                    }}
                    renderItem={renderItem}
                    data={pushNewButton(checks.data)}
                    style={{
                        flexGrow: 0,
                    }}
                />
            </Skeleton>
        </View>
    )
}

export default ChecksList

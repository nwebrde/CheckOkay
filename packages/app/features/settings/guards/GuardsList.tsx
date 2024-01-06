import React from 'react'

import type Check from 'app/provider/app-context/types/check'
import { View } from 'app/design/view'
import { LAST_ITEM_ID } from 'app/features/settings/checks/const'
import { trpc } from 'app/provider/trpc-client'
import { EmptyItem } from 'app/features/settings/checks/EmptyItem'
import { FlatList } from 'react-native'
import GuardsListItem from 'app/features/settings/guards/GuardsListItem'
import Guard from 'app/provider/app-context/types/guardUser'

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

const GuardsList = () => {
    const guards = trpc.getUser.useQuery()

    const renderItem = ({ item }: { item: Guard }) => {
        return <GuardsListItem item={item} />
    }

    return (
        <View>
            <FlatList
                // Saving reference to the `FlashList` instance to later trigger `prepareForLayoutAnimationRender` method.
                numColumns={5}
                // This prop is necessary to uniquely identify the elements in the list.
                keyExtractor={(item: Guard) => {
                    return item.guardUser.id
                }}
                columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 5 }}
                renderItem={renderItem}
                data={guards.data?.guards}
                style={{
                    flexGrow: 0,
                }}
            />
        </View>
    )
}

export default GuardsList

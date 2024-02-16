import React from 'react'

import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { FlatList } from 'react-native'
import GuardsListItem from 'app/features/settings/guards/GuardsListItem'
import { Skeleton } from 'moti/skeleton'
import { EmptyItem } from 'app/features/settings/guards/EmptyItem'
import {Guard} from "app/lib/types/guardUser";

const GuardsList = ({ invite }: { invite: () => void }) => {
    const guards = trpc.getUser.useQuery()

    const renderItem = ({ item }: { item: Guard }) => {
        return <GuardsListItem item={item} />
    }

    return (
        <View>
            <Skeleton colorMode="light" width={'100%'} show={guards.isLoading}>
                <FlatList
                    // Saving reference to the `FlashList` instance to later trigger `prepareForLayoutAnimationRender` method.
                    numColumns={5}
                    // This prop is necessary to uniquely identify the elements in the list.
                    keyExtractor={(item: Guard) => {
                        return item.guardUser.id
                    }}
                    scrollEnabled={false}
                    ListEmptyComponent={<EmptyItem invite={invite} />}
                    columnWrapperStyle={{
                        flexWrap: 'wrap',
                        flex: 1,
                        marginTop: 5,
                    }}
                    renderItem={renderItem}
                    data={guards.data?.guards}
                    style={{
                        flexGrow: 0,
                    }}
                />
            </Skeleton>
        </View>
    )
}

export default GuardsList

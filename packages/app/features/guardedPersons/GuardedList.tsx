import React from 'react'

import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { FlatList } from 'react-native'
import GuardedListItem from 'app/features/guardedPersons/GuardedListItem'
import { EmptyItem } from 'app/features/guardedPersons/EmptyItem'
import { Skeleton } from 'moti/skeleton'
import {Guarded} from "app/lib/types/guardedUser";
import { ScrollView } from 'moti'

const GuardedList = () => {
    const guardedUsers = trpc.getUser.useQuery()

    const renderItem = ({ item }: { item: Guarded }) => {
        return <GuardedListItem item={item} />
    }

    return (
        <View className="h-full w-full">
            <Skeleton
                colorMode="light"
                width={'100%'}
                show={guardedUsers.isLoading}
            >
                <FlatList
                    // Saving reference to the `FlashList` instance to later trigger `prepareForLayoutAnimationRender` method.
                    numColumns={2}
                    className="h-full w-full"

                    // This prop is necessary to uniquely identify the elements in the list.
                    keyExtractor={(item: Guarded) => {
                        return item.id
                    }}
                    scrollEnabled={false}
                    columnWrapperStyle={{
                        flexWrap: 'wrap',
                        flex: 1,
                        gap: 15,
                        marginTop: 5,
                    }}
                    ListEmptyComponent={<EmptyItem />}
                    renderItem={renderItem}
                    data={guardedUsers.data?.guardedUsers}
                    style={{
                        flexGrow: 0,
                    }}
                />
            </Skeleton>
        </View>
    )
}

export default GuardedList

import React from 'react'

import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { FlatList } from 'react-native'
import GuardedUser from 'app/provider/app-context/types/guardedUser'
import GuardedListItem from 'app/features/guardedPersons/GuardedListItem'

const GuardedList = () => {
    const guardedUsers = trpc.getUser.useQuery()

    const renderItem = ({ item }: { item: GuardedUser }) => {
        return <GuardedListItem item={item} />
    }

    return (
        <View>
            <FlatList
                // Saving reference to the `FlashList` instance to later trigger `prepareForLayoutAnimationRender` method.
                numColumns={2}
                // This prop is necessary to uniquely identify the elements in the list.
                keyExtractor={(item: GuardedUser) => {
                    return item.guardedUser.id
                }}
                columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 5 }}
                renderItem={renderItem}
                data={guardedUsers.data?.guardedUsers}
                style={{
                    flexGrow: 0,
                }}
            />
        </View>
    )
}

export default GuardedList

import { Pressable } from 'react-native'
import React, { useRef } from 'react'
import { TimePicker } from 'app/design/timepicker/timepicker'
import { XMark } from '@nandorojo/heroicons/20/solid'
import { View } from 'app/design/view'
import type Check from 'app/provider/app-context/types/check'
import { trpc } from 'app/provider/trpc-client'
import { StyledPressable } from 'app/design/button'
import { LAST_ITEM_ID } from 'app/features/settings/checks/const'
import { Text } from 'app/design/typography'
import Guard from 'app/provider/app-context/types/guardUser'

const renderItem = ({ item }: { item: Guard }) => {
    const switchTypeMutation = trpc.guards.switchType.useMutation()
    const deleteMutation = trpc.guards.delete.useMutation()
    const switchType = () => {
        switchTypeMutation.mutate({
            guardUserId: item.guardUser.id,
        })
    }
    const remove = () => {
        deleteMutation.mutate({
            guardUserId: item.guardUser.id,
        })
    }

    return (
        <View className="m-2 flex-row items-center justify-around rounded-full bg-gray-200 p-1.5 pl-3">
            <Text>
                {item.guardUser.name
                    ? item.guardUser.name
                    : item.guardUser.email}
            </Text>
            <StyledPressable
                onPress={remove}
                className={`
      ml-2 mr-2 rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
            >
                <XMark />
            </StyledPressable>
        </View>
    )
}

export default renderItem

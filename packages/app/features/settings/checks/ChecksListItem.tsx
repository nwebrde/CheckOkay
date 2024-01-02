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

const renderItem = ({ item }: { item: Check }) => {
    const modifyMutation = trpc.checks.modify.useMutation()
    const removeMutation = trpc.checks.remove.useMutation()
    const addMutation = trpc.checks.add.useMutation()
    const modify = (hour: number, minute: number) => {
        modifyMutation.mutate({
            hour: hour,
            minute: minute,
            checkId: item.checkId,
        })
    }
    const remove = () => {
        removeMutation.mutate({
            checkId: item.checkId,
        })
    }

    const add = () => {
        addMutation.mutate({ hour: 23, minute: 59 })
    }

    if (item.checkId === LAST_ITEM_ID) {
        return (
            <Pressable>
                <View className="m-2 flex-row items-center justify-center p-2">
                    <StyledPressable
                        onPress={add}
                        className={`
      rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
                    >
                        <Text>Hinzufügen</Text>
                    </StyledPressable>
                </View>
            </Pressable>
        )
    }

    return (
        <Pressable>
            <View className="m-2 flex-row items-center justify-around rounded-full bg-gray-200 p-2">
                <TimePicker
                    hour={item.hour}
                    minute={item.minute}
                    onChange={modify}
                />
                <StyledPressable
                    onPress={remove}
                    className={`
      ml-5 rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
                >
                    <XMark />
                </StyledPressable>
            </View>
        </Pressable>
    )
}

export default renderItem

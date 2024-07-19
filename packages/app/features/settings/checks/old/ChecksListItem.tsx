import { Pressable } from 'react-native'
import React from 'react'
import { TimepickerOld } from 'app/design/timepicker/timepickerOld'
import { XMark } from '@nandorojo/heroicons/20/solid'
import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { StyledPressable } from 'app/design/button'
import { LAST_ITEM_ID } from 'app/features/settings/checks/const'
import { Text } from 'app/design/typography'
import {Check} from "app/lib/types/check";

const renderItem = ({
    item,
    latestItem,
}: {
    item: Check
    latestItem?: Check
}) => {
    const modifyMutation = trpc.checks.modify.useMutation()
    const removeMutation = trpc.checks.remove.useMutation()
    const addMutation = trpc.checks.add.useMutation()
    const modify = (hour: number, minute: number) => {
        modifyMutation.mutate({
            hour: hour,
            minute: minute,
            checkId: item.id,
        })
    }
    const remove = () => {
        removeMutation.mutate({
            checkId: item.id,
        })
    }

    const add = () => {
        let hour = 9
        let minute = 0
        if (latestItem) {
            hour = latestItem.hour + 1
            if (hour > 23) {
                hour = 23
                minute = latestItem.minute + 1
            }
        }

        addMutation.mutate({ hour: hour, minute: minute })
    }

    if (item.id === LAST_ITEM_ID) {
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
            <View className="m-2 flex-row items-center justify-around rounded-full bg-gray-200 p-1.5 pl-3">
                <TimepickerOld
                    hour={item.hour}
                    minute={item.minute}
                    onChange={modify}
                    displayTimeInLocalFormat
                />
                <StyledPressable
                    onPress={remove}
                    className={`
      ml-2 mr-2 rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
                >
                    <XMark />
                </StyledPressable>
            </View>
        </Pressable>
    )
}

export default renderItem

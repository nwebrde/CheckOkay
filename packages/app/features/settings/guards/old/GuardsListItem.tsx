import React from 'react'
import { XMark } from 'app/design/icons'
import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { StyledPressable } from 'app/design/button'
import { Text } from 'app/design/typography'
import { BellAlert, BellSnooze } from '@nandorojo/heroicons/20/solid'
import {Guard, GuardType} from "app/lib/types/guardUser";

const renderItem = ({ item }: { item: Guard }) => {
    const switchTypeMutation = trpc.guards.switchType.useMutation()
    const deleteMutation = trpc.guards.deleteGuard.useMutation()
    const switchType = () => {
        switchTypeMutation.mutate({
            guardUserId: item.id,
        })
    }
    const remove = () => {
        deleteMutation.mutate({
            guardUserId: item.id,
        })
    }

    return (
        <View className="m-2 flex-row items-center justify-around rounded-full bg-gray-200 p-1.5 pl-3">
            <Text>
                {item.name ?? item.email}
            </Text>
            <StyledPressable
                onPress={switchType}
                className={`
      ml-2 rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
            >
                {item.priority == GuardType.IMPORTANT && (
                    <BellAlert color="#ebb434" />
                )}
                {item.priority == GuardType.BACKUP && (
                    <BellSnooze color="#4f36c9" />
                )}
            </StyledPressable>
            <Text className="text-red-400">
                <XMark className="text-red-400" />
            </Text>

            <StyledPressable
                onPress={remove}
                className={`
      ml-2 mr-2 rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-red-500 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
            >
                <XMark className="text-red-400" />
            </StyledPressable>
        </View>
    )
}

export default renderItem

import React from 'react'
import { XMark } from '@nandorojo/heroicons/20/solid'
import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { StyledPressable } from 'app/design/button'
import { Text } from 'app/design/typography'
import Guard, { GuardType } from 'app/provider/app-context/types/guardUser'
import { BellAlert, BellSnooze } from '@nandorojo/heroicons/20/solid'

const renderItem = ({ item }: { item: Guard }) => {
    const switchTypeMutation = trpc.guards.switchType.useMutation()
    const deleteMutation = trpc.guards.deleteGuard.useMutation()
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

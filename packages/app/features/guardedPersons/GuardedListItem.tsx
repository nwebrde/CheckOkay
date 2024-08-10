import React from 'react'
import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { StyledPressable } from 'app/design/button'
import { Text } from 'app/design/typography'
import { Card, VSpacer } from 'app/design/layout'
import Moment from 'react-moment'
import {CheckState} from "app/lib/types/check";
import {Guarded} from "app/lib/types/guardedUser";
import { AvatarName } from 'app/features/user/AvatarName'
import { XMark } from 'app/design/icons'

const renderItem = ({ item }: { item: Guarded }) => {
    const deleteMutation = trpc.guards.deleteGuardedUser.useMutation()
    const remove = () => {
        deleteMutation.mutate({
            guardedUserId: item.id,
        })
    }

    return (
        <Card
            className={`p-2 md:shrink md:max-w-[calc(49%)] w-full ${
                item.state == CheckState.OK
                    ? 'bg-lime-200'
                    : item.state == CheckState.NOTIFIED
                      ? 'bg-amber-200'
                      : 'bg-orange-200'
            }`}
        >
            <View className="flex-row items-center justify-between">
                <View className="basis-4/5 truncate">
                    <AvatarName name={item.name} email={item.email} image={item.image} />
                </View>

                <StyledPressable
                    onPress={remove}
                    className={`
      ml-2 mr-2 rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
                >
                    <XMark className="text-red-500 stroke-red-500 stroke-2" />
                </StyledPressable>
            </View>
            <VSpacer />
            {item.lastCheckIn && (
                <Text className="font-medium">
                    Letzte {item.step ? 'automatische ' : 'manuelle '}
                    Rückmeldung{' '}
                    <Moment
                        element={Text}
                        className="font-bold"
                        locale="de"
                        date={item.lastCheckIn}
                        fromNow
                    />.
                    {item.nextRequiredCheckIn && (
                        <Text className="">
                            {' '}Nächste Rückmeldung bis{' '}
                            <Moment
                                element={Text}
                                locale="de"
                                date={item.nextRequiredCheckIn}
                                fromNow
                            />.
                        </Text>
                    )}
                </Text>
            )}
        </Card>
    )
}

export default renderItem

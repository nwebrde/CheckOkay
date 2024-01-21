import React from 'react'
import { XMark } from '@nandorojo/heroicons/20/solid'
import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { StyledPressable } from 'app/design/button'
import { H1, Text } from 'app/design/typography'
import GuardedUser, {
    CheckState,
} from 'app/provider/app-context/types/guardedUser'
import { Card, VSpacer } from 'app/design/layout'
import Moment from 'react-moment'

const renderItem = ({ item }: { item: GuardedUser }) => {
    const deleteMutation = trpc.guards.deleteGuardedUser.useMutation()
    const remove = () => {
        deleteMutation.mutate({
            guardedUserId: item.guardedUser.id,
        })
    }

    return (
        <Card
            className={`flex-col p-2 ${
                item.state == CheckState.OK
                    ? 'bg-lime-200'
                    : item.state == CheckState.NOTIFIED
                      ? 'bg-amber-200'
                      : 'bg-orange-200'
            }`}
        >
            <View className="flex-row items-center justify-between">
                <H1 className="my-0 mb-0 mt-0 text-xl">
                    {item.guardedUser.name
                        ? item.guardedUser.name
                        : item.guardedUser.email}
                </H1>

                <StyledPressable
                    onPress={remove}
                    className={`
      ml-2 mr-2 rounded-full border border-gray-300 bg-white bg-opacity-30 p-2 font-semibold text-gray-800 shadow hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100 active:ring-4
    `}
                >
                    <XMark />
                </StyledPressable>
            </View>
            <VSpacer />
            {item.lastCheckOkay && (
                <Text>
                    Letzte {item.step ? 'automatische ' : 'manuelle '}
                    Rückmeldung{' '}
                    <Moment
                        element={Text}
                        locale="de"
                        date={new Date(item.lastCheckOkay)}
                        fromNow
                    />
                </Text>
            )}
            {item.nextRequiredCheckDate && (
                <Text>
                    Nächste Rückmeldung bis{' '}
                    <Moment
                        element={Text}
                        locale="de"
                        date={new Date(item.nextRequiredCheckDate)}
                        fromNow
                    />
                </Text>
            )}
        </Card>
    )
}

export default renderItem

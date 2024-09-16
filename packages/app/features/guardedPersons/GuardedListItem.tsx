import React from 'react'
import { View } from 'app/design/view'
import { trpc } from 'app/provider/trpc-client'
import { Button, StyledPressable } from 'app/design/button'
import { Text } from 'app/design/typography'
import { Card, VSpacer } from 'app/design/layout'
import Moment from 'react-moment'
import {CheckState} from "app/lib/types/check";
import {Guarded} from "app/lib/types/guardedUser";
import { AvatarName } from 'app/features/user/AvatarName'
import { XMark } from 'app/design/icons'
import { ActivityIndicator } from 'react-native'
import * as Burnt from 'burnt'
import { clsx } from 'clsx'
import { confirmAlert } from 'app/design/confirm'

const renderItem = ({ item }: { item: Guarded }) => {
    const deleteMutation = trpc.guards.deleteGuardedUser.useMutation()
    const checkIn = trpc.guards.checkInForGuardedUser.useMutation()
    const pause =  trpc.guards.pauseWarningsForGuardedUser.useMutation()


    const remove = () => {
        confirmAlert("Bist du sicher dass du " + ((item.name == "" || !item.name) ? item.email : item.name) + " nicht mehr beschützen möchtest?", () => deleteMutation.mutate({
            guardedUserId: item.id,
        }), () => {}, true, ((item.name == "" || !item.name) ? item.email : item.name) + " entfernen?")
    }

    const checkGuardedIn = async () => {
        await checkIn.mutateAsync({
            guardedUserId: item.id
        })
        Burnt.toast({
            title: ((item.name == "" || !item.name) ? item.email : item.name) + " ist zurückgemeldet", // required

            preset: "done", // or "error", "none", "custom"

            haptic: "success", // or "success", "warning", "error"

            duration: 2, // duration in seconds

            shouldDismissByDrag: true,

            from: "top", // "top" or "bottom"
        });
    }

    const isActive = () => {
        return item.pausedForNextReqCheckInDate === undefined ||
        (new Date(item.pausedForNextReqCheckInDate)).getTime() < (new Date(item.nextRequiredCheckIn!)).getTime()
    }

    const pauseGuard = async () => {
        const isActiveNow = isActive()
        await pause.mutateAsync({
            guardedUserId: item.id,
            pause: isActiveNow
        })
        Burnt.toast({
            title: "Warnungen für " + ((item.name == "" || !item.name) ? item.email : item.name) + (isActiveNow ? " pausiert" : "  fortgesetzt"), // required

            preset: "done", // or "error", "none", "custom"

            haptic: "success", // or "success", "warning", "error"

            duration: 2, // duration in seconds

            shouldDismissByDrag: true,

            from: "top", // "top" or "bottom"
        });
    }

    return (
        <Card
            className={`p-2 md:shrink md:max-w-[calc(49%)] w-full ${
                item.state == CheckState.OK
                    ? 'bg-lime-200 border border-lime-600'
                    : item.state == CheckState.NOTIFIED
                      ? 'bg-amber-200 border border-amber-400'
                      : 'bg-orange-200 border border-orange-400'
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

            <View className="mb-8" />

            {item.state == CheckState.WARNED &&
                <>

                <View className="flex flex-row grow mb-2 flex-wrap gap-2">
                    <StyledPressable className="bg-primary rounded-xl p-2 grow" onPress={checkGuardedIn}>
                        {checkIn.isLoading &&
                        <ActivityIndicator />
                        }
                        {!checkIn.isLoading &&
                        <Text className="w-full text-lime-200 font-bold text-center">Alles ok &#128077;</Text>
                        }
                    </StyledPressable>
                    <StyledPressable className={clsx("rounded-xl p-2 grow", isActive() ? "bg-white" : "bg-amber-600")} onPress={pauseGuard}>
                        {pause.isLoading &&
                            <ActivityIndicator />
                        }
                        {!pause.isLoading &&
                            <Text className={clsx("w-full text-center", isActive() ? "" : "text-amber-200")}>Warnungen {isActive() ? "pausieren" : "fortsetzen"}</Text>
                        }
                    </StyledPressable>
                </View>
                </>
            }


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
                            {' '}{(item.state == CheckState.OK || item.state == CheckState.NOTIFIED) ? "Nächste Rückmeldung bis" : "Rückmeldung ist fällig seit"}{' '}
                            <Moment
                                element={Text}
                                locale="de"
                                ago={item.state != CheckState.OK && item.state != CheckState.NOTIFIED}
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

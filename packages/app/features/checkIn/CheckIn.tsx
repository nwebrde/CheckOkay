import { Text, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { Card, HSpacer, Row } from 'app/design/layout'
import { AnimatedLink, AnimatedPressable, StyledLink } from 'app/design/button'
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { trpc } from 'app/provider/trpc-client'
import { SetupChecks } from 'app/features/checkIn/SetupChecks'
import { Skeleton } from 'moti/skeleton'
import {CheckState} from "app/lib/types/check";
import { Cog6Tooth } from 'app/design/icons'
import * as Burnt from 'burnt'


const isCheckInPossible = (checkInPossibleFrom: Date | undefined) => {
    if(!checkInPossibleFrom) {
        return true
    }
    return checkInPossibleFrom.getTime() <= (new Date()).getTime()
}

export function CheckIn() {
    const checkOkay = trpc.checks.checkIn.useMutation()
    const user = trpc.getUser.useQuery()
    const [checkInPossible, setCheckInPossible] = useState(false)

    useEffect(() => {
        setCheckInPossible(isCheckInPossible(user.data?.nextCheckInPossibleFrom))
    }, [user.data])

    const isSetup = () => {
        if (!user.data) {
            return false
        }
        if (!user.data.nextRequiredCheckIn) {
            return false
        }
        if (!user.data.guards) {
            return false
        }
        if (user.data.guards.length <= 0) {
            return false
        }
        return true
    }

    const check = async () => {
        await checkOkay.mutateAsync({
            step: false,
        })
        Burnt.toast({
            title: "Du hast dich zurückgemeldet", // required

            preset: "done", // or "error", "none", "custom"

            haptic: "success", // or "success", "warning", "error"

            duration: 2, // duration in seconds

            shouldDismissByDrag: true,

            from: "top", // "top" or "bottom"
        });
    }
    return (
        <View className="w-auto">
            <Skeleton colorMode="light" width={'100%'} show={user.isLoading}>
                {user.data && (
                    <>
                        {(isSetup() && checkInPossible) && (
                            <Card
                                className={`w-full ${
                                    user.data?.state == CheckState.OK
                                        ? 'bg-lime-200 border-2 border-lime-600'
                                        : user.data?.state ==
                                            CheckState.NOTIFIED
                                          ? 'bg-amber-200 border-2 border-amber-400'
                                          : 'bg-orange-200 border-2 border-orange-400'
                                }`}
                            >
                                <Row className="items-center justify-between">
                                    <Text type="H1" className="my-0 opacity-75">
                                        Ist alles okay?
                                    </Text>
                                </Row>

                                <Row className="mt-5 gap-5 items-center">
                                    <AnimatedPressable onClick={check}>
                                        <Text
                                            type="unstyled"
                                            selectable={false}
                                            className="text-base font-bold rounded-xl p-3 overflow-hidden bg-primary text-ok text-[3rem]"
                                        >
                                            Ja &#128077;
                                        </Text>
                                    </AnimatedPressable>
                                    <View className="flex-col shrink">


                                        {user.data?.nextRequiredCheckIn && (
                                            <Text className="font-medium">
                                                {(user.data.state == CheckState.OK || user.data.state == CheckState.NOTIFIED) ? "Beantworte diese Frage bis" : "Deine Rückmeldung war fällig"}{' '}
                                                <Moment
                                                    element={Text}
                                                    locale="de"
                                                    className="font-bold"
                                                    date={user.data.nextRequiredCheckIn}
                                                    fromNow
                                                />.
                                            </Text>
                                        )}
                                    </View>
                                </Row>
                                {user.data?.lastCheckIn && (
                                    <Text className="mt-5">
                                        Deine letzte Rückmeldung war{' '}
                                        {user.data?.step
                                            ? 'automatisch '
                                            : 'manuell '}
                                        <Moment
                                            element={Text}
                                            locale="de"
                                            date={
                                                new Date(
                                                    user.data?.lastCheckIn,
                                                )
                                            }
                                            fromNow
                                        />.
                                    </Text>
                                )}
                            </Card>
                        )}
                        {(isSetup() && !checkInPossible) && (
                            <Text className="font-medium">Du kannst dich erst in{' '}
                                <Moment
                                    element={Text}
                                    className="font-bold"
                                    locale="de"
                                    date={user.data.nextCheckInPossibleFrom}
                                    fromNow
                                />{' '}wieder rückmelden</Text>

                        )}
                        {!isSetup() && <SetupChecks />}
                    </>
                )}
            </Skeleton>
        </View>
    )
}

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
        <View className="w-fit">
            <Skeleton colorMode="light" width={'100%'} show={user.isLoading}>
                {user.data && (
                    <>
                        {(isSetup() && checkInPossible) && (
                            <Card
                                className={`w-fit ${
                                    user.data?.state == CheckState.OK
                                        ? 'bg-lime-200'
                                        : user.data?.state ==
                                            CheckState.NOTIFIED
                                          ? 'bg-amber-200'
                                          : 'bg-orange-200'
                                }`}
                            >
                                <Row className="items-center justify-between">
                                    <Text type="H1" className="my-0 opacity-75">
                                        Ist alles okay?
                                    </Text>
                                </Row>

                                <Row className="mt-5">
                                    <AnimatedPressable onClick={check}>
                                        <Text
                                            type="unstyled"
                                            selectable={false}
                                            className="text-base font-bold text-xl"
                                        >
                                            Ja &#128077;
                                        </Text>
                                    </AnimatedPressable>
                                    <HSpacer />
                                    <StyledLink
                                        href="/callEmergency"
                                    >
                                        <Text className="text-red-500 font-bold text-xl">Nein &#128078;</Text>
                                    </StyledLink>
                                </Row>
                                {user.data?.nextRequiredCheckIn && (
                                    <Text className="mt-5">
                                        Beantworte diese Frage bis{' '}
                                        <Moment
                                            element={Text}
                                            locale="de"
                                            date={user.data.nextRequiredCheckIn}
                                            fromNow
                                        />
                                        {'\n'}
                                    </Text>
                                )}
                                {user.data?.lastCheckIn && (
                                    <Text>
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
                                        />
                                    </Text>
                                )}
                            </Card>
                        )}
                        {(isSetup() && !checkInPossible) && (
                            <Text>Du kannst dich erst in{' '}
                                <Moment
                                    element={Text}
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

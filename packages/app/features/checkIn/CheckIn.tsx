import { Text, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { Card, HSpacer, Row } from 'app/design/layout'
import { AnimatedLink, AnimatedPressable } from 'app/design/button'
import React from 'react'
import Moment from 'react-moment'
import { trpc } from 'app/provider/trpc-client'
import { Cog6Tooth } from '@nandorojo/heroicons/24/solid'
import { SetupChecks } from 'app/features/checkIn/SetupChecks'
import { Skeleton } from 'moti/skeleton'
import {CheckState} from "app/lib/types/check";

export function CheckIn() {
    const checkOkay = trpc.checks.checkIn.useMutation()
    const user = trpc.getUser.useQuery()

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

    const check = () => {
        checkOkay.mutate({
            step: false,
        })
    }
    return (
        <View className="w-full">
            <Skeleton colorMode="light" width={'100%'} show={user.isLoading}>
                {user.data && (
                    <>
                        {isSetup() && (
                            <Card
                                className={`w-full ${
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
                                    <AnimatedLink href="/settings">
                                        <Cog6Tooth />
                                    </AnimatedLink>
                                </Row>

                                <Row>
                                    <AnimatedPressable onClick={check}>
                                        <Text
                                            selectable={false}
                                            className="text-base font-bold"
                                        >
                                            Ja &#128077;
                                        </Text>
                                    </AnimatedPressable>
                                    <HSpacer />
                                    <TextLink
                                        href="/callEmergency"
                                        className="text-red-500"
                                    >
                                        Nein &#128078;
                                    </TextLink>
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
                        {!isSetup() && <SetupChecks />}
                    </>
                )}
            </Skeleton>
        </View>
    )
}

import { H1, Text, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { Card, HSpacer, Row } from 'app/design/layout'
import { AnimatedLink, AnimatedPressable } from 'app/design/button'
import React, { useEffect } from 'react'
import Moment from 'react-moment'
import { trpc } from 'app/provider/trpc-client'
import { Cog6Tooth } from '@nandorojo/heroicons/24/solid'

export function CheckOkay() {
    const lastCheck = trpc.checks.getLastCheckOkay.useQuery()
    const checkOkay = trpc.checks.checkOkay.useMutation()

    const check = () => {
        checkOkay.mutate({
            step: false,
        })
    }
    return (
        <View className="w-full">
            <Card className="w-full">
                <Row className="justify-between">
                    <H1 className="text-primary my-0">Ist alles okay?</H1>
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
                    <TextLink href="/callEmergency" className="text-red-500">
                        Nein &#128078;
                    </TextLink>
                </Row>
                {lastCheck.data?.latestCheck && (
                    <Text className="mt-5">
                        Beantworte diese Frage bis ... {'\n'}
                        Deine letzte Rückmeldung war{' '}
                        {lastCheck.data.step ? 'automatisch ' : 'manuell '}
                        <Moment
                            element={Text}
                            locale="de"
                            date={new Date(lastCheck.data.latestCheck)}
                            fromNow
                        />
                    </Text>
                )}
            </Card>
        </View>
    )
}

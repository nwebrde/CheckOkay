import { H1, Text, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { Card, Row } from 'app/design/layout'
import { AnimatedLink } from 'app/design/button'
import React from 'react'
import { Cog6Tooth } from '@nandorojo/heroicons/24/solid'

export function SetupChecks() {
    return (
        <View className="w-full">
            <Card className="w-full">
                <H1 className="text-primary my-0">Richte CheckOkay ein</H1>

                <Text className="mt-5">
                    Damit du die App nutzen kannst, lege bitte
                    Kontrollzeitpunkte fest und lade Freunde ein die dich
                    beschützen.
                </Text>
                <AnimatedLink href="/settings">
                    <Row className="mt-5 items-center justify-center">
                        <Cog6Tooth />
                        <Text className="text-lg"> App einrichten</Text>
                    </Row>
                </AnimatedLink>
            </Card>
        </View>
    )
}

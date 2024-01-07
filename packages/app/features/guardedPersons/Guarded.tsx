import { H1 } from 'app/design/typography'
import { View } from 'app/design/view'
import { Row } from 'app/design/layout'
import React from 'react'
import GuardedList from 'app/features/guardedPersons/GuardedList'

export function Guarded() {
    return (
        <>
            <View className="w-full">
                <Row className="items-center justify-between">
                    <H1>Zustand deiner Freunde</H1>
                </Row>
                <GuardedList />
            </View>
        </>
    )
}

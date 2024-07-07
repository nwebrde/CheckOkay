import { Text } from 'app/design/typography'
import { View } from 'app/design/view'
import { Row } from 'app/design/layout'
import React from 'react'
import GuardedList from 'app/features/guardedPersons/GuardedList'

export function Guarded() {
    return (
        <>
            <View className="w-full">
                <Row className="items-center justify-between">
                    <Text type="H1">Zustand deiner Freunde</Text>
                </Row>
                <GuardedList />
            </View>
        </>
    )
}

'use client'
import { Screen, VSpacer } from 'app/design/layout'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import React, { useState } from 'react'

export function HomeScreen() {
    const [test, setTest] = useState("some input")



    return (
        <Screen width="max-w-xl">
            <CheckIn />
            <VSpacer />
            <Guarded />
        </Screen>
    )
}

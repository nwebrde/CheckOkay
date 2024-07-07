'use client'
import { P, Text, TextLink } from 'app/design/typography'
import { Row, Screen, VSpacer } from 'app/design/layout'
import { View } from 'app/design/view'

import { MotiLink } from 'solito/moti/app'
import { trpc } from 'app/provider/trpc-client'
import { useAuth } from 'app/provider/auth-context'
import { Button } from 'app/design/button'

import { useRouter } from 'solito/navigation'
import { CheckIn } from 'app/features/checkIn/CheckIn'
import { Guards } from 'app/features/settings/guards/Guards'
import { Guarded } from 'app/features/guardedPersons/Guarded'
import {TextInput} from 'react-native';
import React, { useState } from 'react'
import { Input } from 'app/design/input'
import { TimepickerOld } from 'app/design/timepicker/timepickerOld'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import { Link } from 'solito/link'

export function HomeScreen() {
    const [test, setTest] = useState("some input")



    return (
        <Screen width="max-w-xl">
           <Link href="/settings"><Text>Settings</Text></Link>
            <TimepickerOld hour={2} minute={3} onChange={() => {}} />
            <Input placeholder='Write some stuff...'
                   value={test}
                   onChangeText={setTest}
                   aria-labelledbyledBy='inputLabel'
                   aria-errormessage='inputError' />
            <VSpacer />
            <TextInput
                onChangeText={setTest}
                value={test}
                className="border h-12 border-gray-400 rounded-lg w-full py-2 px-3 focus:border-gray-800 focus:border-2"
            />
            <CheckIn />
            <VSpacer />
            <Guarded />
        </Screen>
    )
}

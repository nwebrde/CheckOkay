import { GuardsScreen } from 'app/features/settings/guards/GuardsScreen'
import { Text } from 'app/design/typography'
import { Link, Stack, useRouter } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Notifications } from 'app/features/settings/notifications/notifications'
import { AddMail, AddMailHandle } from 'app/features/settings/notifications/AddMail'
import { StyledPressable } from 'app/design/button'
import { ActivityIndicator } from 'react-native'
import { Toast } from 'react-native-toast-notifications'
import { TimepickerOld } from 'app/design/timepicker/timepickerOld'


type ProceedProps = {
    state: "idle" | "loading" | "error" | "success"
    handleProceed: () => void
}

const Proceed = ({ state, handleProceed } : ProceedProps) => {
    return (
        <>
            {state == 'idle' &&
                <StyledPressable onPress={handleProceed}><Text>Weiter</Text></StyledPressable>
            }
            {state == 'loading' &&
                <ActivityIndicator />
            }
        </>

    )
}

export default function Page() {
    const ref = useRef<AddMailHandle>(null);
    const router = useRouter()

    async function handleAdd() {
        try {
            await ref.current?.add()
            router.back();
        } catch (error) {
        }
    }

    const toastRef = useRef();
    return (
        <>
            <Stack.Screen options={{headerTitle: "Email hinzufügen",
                headerRight: () => <Proceed handleProceed={handleAdd} state="idle" />, headerLeft: () => <Link href="../"><Text>Abbrechen</Text></Link> }} />
            <AddMail ref={ref} />
        </>
        )
}
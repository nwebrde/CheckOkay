import { GuardsScreen } from 'app/features/settings/guards/GuardsScreen'
import { Text } from 'app/design/typography'
import { Link, Stack, useRouter } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Notifications } from 'app/features/settings/notifications/notifications'
import { SetReminder, SetReminderHandle } from 'app/features/settings/notifications/SetReminder'
import { StyledPressable } from 'app/design/button'
import { ActivityIndicator } from 'react-native'
import { Toast } from 'react-native-toast-notifications'
import { TimepickerOld } from 'app/design/timepicker/timepickerOld'
import { TimePicker } from 'app/design/timepicker/timepicker'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { View } from 'app/design/view'


type ProceedProps = {
    state: "idle" | "loading" | "error" | "success"
    handleProceed: () => void
}

const Proceed = ({ state, handleProceed } : ProceedProps) => {
    return (
        <>
            {state == 'idle' &&
                <StyledPressable onPress={handleProceed}><Text>Fertig</Text></StyledPressable>
            }
            {state == 'loading' &&
                <ActivityIndicator />
            }
        </>

    )
}

export default function Page() {
    const ref = useRef<SetReminderHandle>(null);
    const router = useRouter()

    async function handleDone() {
        try {
            await ref.current?.done()
            router.back();
        } catch (error) {
        }
    }

    return (
        <>
            <Stack.Screen options={{headerTitle: "Erinnerungszeitpunkt festlegen",
                headerRight: () => <Proceed handleProceed={handleDone} state={ref.current!.state} />, headerLeft: () => <Link href="../"><Text>Abbrechen</Text></Link> }} />
            <View className="self-center p-5 pt-10">
                <SetReminder ref={ref} />
                <Text className="mt-10">Wähle aus, wie viele Stunden und Minuten vor einem Check-In wir dich daran erinnern rückzumelden. Ziehe dafür die Zahlen an die gewünschte Position</Text>
            </View>
        </>
    )
}
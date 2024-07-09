import { Text } from 'app/design/typography'
import { Link, Stack, useRouter } from 'expo-router'
import React from 'react'
import { StyledPressable } from 'app/design/button'
import { ActivityIndicator } from 'react-native'
import { ModalProps, ProceedProps } from 'app/design/modal/types'

const Proceed = ({ state, handleProceed, label } : ProceedProps) => {
    return (
        <>
            {state == 'idle' &&
                <StyledPressable onPress={handleProceed}><Text>{label}</Text></StyledPressable>
            }
            {state == 'loading' &&
                <ActivityIndicator />
            }
        </>

    )
}

/**
 *
 * @param title
 * @param proceedLabel
 * @param cancelLabel
 * @param routeIdentifier only needed for nextjs, not for expo
 * @param children
 * @param childRef
 * @constructor
 */
export default function Modal({title, proceedLabel, cancelLabel, routeIdentifier, children, childRef}: ModalProps) {
    const router = useRouter()

    async function handleDone() {
        try {
            await childRef.current?.proceedHandler()
            router.back();
        } catch (error) {
        }
    }

    return (
        <>
            <Stack.Screen options={{headerTitle: title,
                headerRight: () => <Proceed handleProceed={handleDone} label={proceedLabel} state={childRef.current?.state} />, headerLeft: () => <Link href="../"><Text>{cancelLabel}</Text></Link> }} />
            {children}
        </>
    )
}
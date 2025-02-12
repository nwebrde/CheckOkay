import { Text } from 'app/design/typography'
import { Link, Stack, useRouter } from 'expo-router'
import React, { forwardRef, useImperativeHandle } from 'react'
import { StyledPressable } from 'app/design/button'
import { ActivityIndicator } from 'react-native'
import { ModalProps, ModalRef, ProceedProps } from 'app/design/modal/types'

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
export const Modal = forwardRef<ModalRef, ModalProps>(({title, proceedLabel, proceedChild, cancelLabel, routeIdentifier, children, childRef}, ref) => {
    const router = useRouter()

    const close = () => {
        router.back();
    }

    async function proceed() {
        try {
            await childRef.current?.proceedHandler()
            close();
        } catch (error) {
        }
    }

    useImperativeHandle(ref, () => {
        return {
            close,
            proceed
        }
    }, [childRef])

    return (
        <>
            <Stack.Screen options={{headerTitle: title,
                headerRight: () => ((proceedChild) ? {proceedChild} : <Proceed handleProceed={proceed} label={proceedLabel} state={childRef.current?.state} />), headerLeft: () => <Link href="../"><Text>{cancelLabel}</Text></Link> }} />
            {children}
        </>
    )
})
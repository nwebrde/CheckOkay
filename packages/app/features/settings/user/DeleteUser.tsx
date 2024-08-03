'use client'
import React, { forwardRef, useImperativeHandle } from 'react'
import { Text } from 'app/design/typography'
import { trpc } from 'app/provider/trpc-client'
import { HandlerRef } from 'app/design/modal/types'
import { View } from 'app/design/view'
import * as Burnt from 'burnt'
import { useAuth } from 'app/provider/auth-context'

type Props = {}

export const DeleteUser = forwardRef<HandlerRef, Props>((props, ref) => {
    const auth = useAuth();
    const deleteMutation = trpc.user.deleteUser.useMutation({
        onError: () => {
            Burnt.toast({
                title: "Fehler", // required

                preset: "error", // or "error", "none", "custom"

                message: "Konto wurde nicht gelöscht", // optional

                haptic: "error", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });
        },
        onSuccess: () => {
            Burnt.toast({
                title: "Konto wurde gelöscht", // required

                preset: "done", // or "error", "none", "custom"

                haptic: "success", // or "success", "warning", "error"

                duration: 2, // duration in seconds

                shouldDismissByDrag: true,

                from: "top", // "top" or "bottom"
            });
            auth?.signOut();
        }
    })

    useImperativeHandle(ref, () => {
        return {
            proceedHandler,
            state: deleteMutation.status
        }
    }, [deleteMutation.status])

    const proceedHandler = async () => {
        return deleteMutation.mutateAsync()
    }

    return (
            <View className="self-center p-5 pt-10">
                <Text>Wenn du fortfährst wird dein Konto sowie alle damit verknüpften Daten entgültig gelöscht. Du kannst dich erneut registrieren wenn du CheckOkay wieder benutzen möchtest.</Text>
            </View>
    )
} )

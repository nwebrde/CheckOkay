import { H1, Text, TextLink } from 'app/design/typography'
import { View } from 'app/design/view'
import { Card, HSpacer, Row } from 'app/design/layout'
import {
    AnimatedLink,
    AnimatedPressable,
    Button,
    MotiPressable,
} from 'app/design/button'
import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import { trpc } from 'app/provider/trpc-client'
import { Cog6Tooth, PlusCircle } from '@nandorojo/heroicons/24/solid'
import { ShareButton } from 'app/design/sharebutton/sharebutton'
import { Alert, Modal, Pressable, StyleSheet } from 'react-native'
import { InviteModal } from 'app/features/settings/guards/InviteModal'
import GuardsList from 'app/features/settings/guards/GuardsList'

export function Guards() {
    const [shareVisible, setShareVisible] = useState(false)

    const onShareClose = () => {
        setShareVisible(false)
    }

    return (
        <>
            <View className="w-full">
                <Row className="items-center justify-between">
                    <H1>Deine Guards</H1>
                    <AnimatedPressable onClick={() => setShareVisible(true)}>
                        <PlusCircle className="h-14" />
                    </AnimatedPressable>
                </Row>
                <GuardsList />
            </View>
            <InviteModal visible={shareVisible} onClose={onShareClose} />
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})

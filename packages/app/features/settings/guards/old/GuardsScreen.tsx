import { Text } from 'app/design/typography'
import { View } from 'app/design/view'
import { Row } from 'app/design/layout'
import {
    AnimatedPressable, MotiLink
} from 'app/design/button'
import React, { useState } from 'react'
import { PlusCircle } from '@nandorojo/heroicons/24/solid'
import { StyleSheet } from 'react-native'
import { InviteModal } from 'app/features/settings/guards/InviteModal'
import GuardsList from 'app/features/settings/guards/GuardsList'
import { Link } from 'solito/link'

export function GuardsScreen() {
    const [shareVisible, setShareVisible] = useState(false)

    const onShareClose = () => {
        setShareVisible(false)
    }

    return (
       <>
            <View>
                <Link href="/settings/emergency"><Text>test</Text></Link>
                <Text>Diese Personen werden gewarnt, wenn du dich nicht rechtzeitig zu einem Check-In Zeitpunkt meldest. Lade
                Personen ein denen du diese Aufgabe anvertrauen möchtest.</Text>
                <Row className="items-center justify-between">
                    <Text type="H1">Deine Guards</Text>
                    <AnimatedPressable onClick={() => setShareVisible(true)}>
                        <PlusCircle className="h-14" />
                    </AnimatedPressable>
                </Row>
                <GuardsList invite={() => setShareVisible(true)} />
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

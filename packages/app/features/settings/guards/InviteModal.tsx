import { ActivityIndicator, Modal, StyleSheet } from 'react-native'
import { View } from 'app/design/view'
import { H1, Text } from 'app/design/typography'
import { ShareButton } from 'app/design/sharebutton/sharebutton'
import { trpc } from 'app/provider/trpc-client'
import { useEffect } from 'react'
import { Button } from 'app/design/button'
import { HSpacer, Row, VSpacer } from 'app/design/layout'

export const InviteModal = ({
    visible,
    onClose,
}: {
    visible: boolean
    onClose: () => void
}) => {
    const linkMutation = trpc.guards.invite.useMutation()
    useEffect(() => {
        if (visible) {
            linkMutation.mutate()
        }
    }, [visible, linkMutation])
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 items-center justify-center backdrop-blur-md">
                <View className="w-4/5 max-w-md rounded-xl bg-white p-5 text-center shadow-lg">
                    <H1 className="my-0 mt-0 text-2xl">
                        Lade einen Guard ein, {'\n'}der dich beschützt
                    </H1>
                    <Text className="mt-3">
                        Die Person wird benachrichtigt, wenn du nicht mehr
                        reagierst. Sie sieht nur, wann du dich zuletzt gemeldet
                        hast.
                    </Text>
                    <VSpacer />
                    {!linkMutation.isLoading && (
                        <Row className="items-center">
                            <ShareButton
                                link={linkMutation.data!}
                                title="Person einladen"
                                msg=""
                            >
                                <Button text="Person einladen" />
                            </ShareButton>
                            <HSpacer />
                            <Button onClick={onClose} text="Fertig" />
                        </Row>
                    )}
                    {linkMutation.isLoading && <ActivityIndicator />}
                </View>
            </View>
        </Modal>
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
